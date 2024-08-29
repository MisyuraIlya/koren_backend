import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';
import { School } from 'src/school/entities/school.entity';
import { Role } from 'src/enums/role.enum';
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetDto } from './dto/reset.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
        @InjectRepository(School)
        private readonly schoolRepository: Repository<School>,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private jwt: JwtService
    ){}

    async register(dto: AuthDto) {
		const existUser = await this.authRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    // if (existUser) throw new BadRequestException('User already Exists');
    if(existUser){
        const existUser = new AuthEntity();
        existUser.email = dto.email
    }
    existUser.password = await hash(dto.password)
    existUser.firstName = dto.firstName
    existUser.lastName = dto.lastName
    existUser.isActive = true
    existUser.isAdmin = dto.isAdmin
    existUser.role = dto.role === 'teacher' ? Role.Teacher : Role.Student
    const save = await this.authRepository.save(existUser);
    const tokens = await this.issueTokens(existUser.id)

    return {
        user: this.returnUsersFields(existUser),
        ...tokens
    }
  }

    async login(dto: AuthDto) {
      const user = await this.validateUser(dto)

      const tokens = await this.issueTokens(user.id)
      const isDevelopment = process.env.STAGE === 'dev';
      if(!isDevelopment){
        const isCaptchaValid = await this.verifyCaptcha(dto.captchaToken);
        console.log('isCaptchaValid',isCaptchaValid)
        if (!isCaptchaValid) {
              throw new BadRequestException('CAPTCHA verification failed');
        }
      }
      return {
        user: this.returnUsersFields(user),
        ...tokens
      }
    }

    async getUserByTypeAndSchool(type: Role, schoolId: string) {
        console.log(type,schoolId)
        const findSchool = await this.schoolRepository.findOne({
            where:{id:+schoolId}
        })

        if (!findSchool) throw new BadRequestException('school with this id is not exist');

        const users = await this.authRepository.find({
            where:{role: type, school:findSchool},
            relations:['school','class']
        })
        return users
    }

    async getUsers(userId:number){
        const findUser = await this.authRepository.findOne({
            where:{id:userId},
            relations:['class','class.students']
        })
        const filter = findUser.class.students?.filter((item) => item.id !== userId)
        return filter
    }

    async getNewTokens(refreshToken: string) {
      try {
        const result = await this.jwt.verifyAsync(refreshToken);
        const user = await this.authRepository.findOne({
          where: {
            id: result.id,
          },
        });

        if (!user) throw new UnauthorizedException('User not found');

        const tokens = await this.issueTokens(user.id);

        return {
          user: this.returnUsersFields(user),
          ...tokens,
        };
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid refresh token');
        }
        if(error.name === 'TokenExpiredError'){
          throw new UnauthorizedException('Invalid refresh token');
        }
        throw error;
      }
    }

    private async issueTokens(userId: number) {
        const data = {id: userId}
    
        const accessToken = this.jwt.sign(data, {
          expiresIn: '15m'
        })
    
        const refreshToken = this.jwt.sign(data, {
          expiresIn: '6h'
        })
    
        return { accessToken, refreshToken }
    }

    private returnUsersFields(user: AuthEntity) {
        delete user.password
        return user
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.authRepository.findOne({
            where:{email:dto.email},
            relations: ['school']
        })
    
        if (!user) throw new NotFoundException('שם משתמש/סיסמה לא נכונים.')
    
        const isValid = await verify(user.password, dto.password)
        if (!isValid) throw new UnauthorizedException('שם משתמש/סיסמה לא נכונים.')
    
        return user
    }

    public async step1(dto: {mail:string}){
      const findUser = await this.authRepository.findOne({
        where:{email:dto.mail}
      })
      if(!findUser) throw new BadRequestException('לא נמצא משתמש');
      const random = Math.floor(10000 + Math.random() * 90000);
      const message = ` ${random} קוד סודי לשחזור סיסמא  ${(await findUser).firstName} שלום `
      findUser.recovery = random.toString()
      this.authRepository.save(findUser)
      const res = await this.mailerService
      .sendMail({
        to: findUser.email, // list of receivers
        from: 'statosbiz@statos.co', // sender address
        subject: 'שחזור סיסמא מערכת שרי', // Subject line
        text: 'welcome', // plaintext body
        html: `<p>${message}</p>`, // HTML body content
      })
      
      return {status:"success"}
    }

    public async step2(dto: {mail:string, token:string}){
      const currentTime = new Date();
      const findUser = await this.authRepository.findOne({
        where:{email:dto.mail}
      })
      if(!findUser) throw new BadRequestException('לא נמצא משתמש');
      if(findUser.blockedTo && currentTime < findUser.blockedTo){
        throw new BadRequestException('בוצעו מספר רב של נסניות, נסה שנית מאוחר יותר');
      }
      if(findUser.recovery !== dto.token) {
        findUser.attempts = findUser.attempts++
        if(findUser.attempts > 5){
          currentTime.setMinutes(currentTime.getMinutes() + 30);
          findUser.blockedTo = currentTime;
        }
        this.authRepository.save(findUser)

        throw new BadRequestException('קוד סודי שגוי');

      };
      return {status:"success"}
   
    }

    public async step3(dto: {mail:string, password:string, token:string}){
      const currentTime = new Date();
      const findUser = await this.authRepository.findOne({
        where:{email:dto.mail}
      })
      if(!findUser) throw new BadRequestException('לא נמצא משתמש');
      if(findUser.blockedTo && currentTime < findUser.blockedTo){
        throw new BadRequestException('בוצעו מספר רב של נסניות, נסה שנית מאוחר יותר');
      }
      if(findUser.recovery !== dto.token) {
        const random = Math.floor(10000 + Math.random() * 90000);
        const message = ` ${random} קוד סודי לשחזור סיסמא  ${(await findUser).firstName} שלום `
        findUser.recovery = random.toString()
        this.authRepository.save(findUser)
        const res = await this.mailerService
        .sendMail({
          to: findUser.email, // list of receivers
          from: 'statosbiz@statos.co', // sender address
          subject: 'שחזור סיסמא מערכת שרי', // Subject line
          text: 'welcome', // plaintext body
          html: `<p>${message}</p>`, // HTML body content
        })
        throw new BadRequestException('קוד סודי שגוי נשלח מייל חוזר');
      }
      findUser.password = await hash(dto.password)
      findUser.recovery = null
      this.authRepository.save(findUser)
      return {status:"success"}
    }

    async updateUser(dto: ResetDto){
      const findUser = await this.authRepository.findOne({
        where:{uuid:dto.uuid}
      })
      if(findUser){
        if(dto.firstName){
          findUser.firstName = dto.firstName
        }
        if(dto.lastName){
          findUser.lastName = dto.lastName
        }
        if(dto.email){
          findUser.email = dto.email
        }
        if(dto.password){
          findUser.password = await hash(dto.password) 
        }
        await this.authRepository.save(findUser)
        return {status:"success", user: findUser}
      }
      return {status:"success"}
    }

    private async verifyCaptcha(captchaToken: string): Promise<boolean>{
      const secretKey = this.configService.get<string>('CLOUD_FLARE_KEY');
      console.log('secretKey',captchaToken,secretKey)
      try {
          const response = await axios.post(
              'https://challenges.cloudflare.com/turnstile/v0/siteverify',
              {     
                secret: secretKey,
                response: captchaToken,
              },
          );
          console.log("response.data.success",response.data)
          return response.data.success;
      } catch (error) {
          console.error('Error verifying CAPTCHA:', error);
          return false;
      }
    }
    
}
