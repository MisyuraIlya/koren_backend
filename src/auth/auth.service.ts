import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        // private jwt: JwtService
    ){}

    async login(dto: AuthDto) {
        const findUser = this.usersRepository.findOne({
            where:{email:dto.email, password:dto.password}
        })
        if(findUser) {
            return findUser
        } else {
            return false
        }
        // const user = await this.validateUser(dto)
		// const tokens = await this.issueTokens(user.id)

		// return {
		// 	user: this.returnUsersFields(user),
		// 	...tokens
		// }
    }


    // private returnUsersFields(user: UsersEntity) {
    //     return {
    //         id: user.id,
    //         email: user.email,
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         isAdmin: user.isAdmin,
    //         userType: user.userType
    //     }
    // }
    // private async issueTokens(userId: number) {
    //     const data = {id: userId}

    //     const accessToken = this.jwt.sign(data, {
    //     expiresIn: '10s'
    //     })

    //     const refreshToken = this.jwt.sign(data, {
    //     expiresIn: '7d'
    //     })

    //     return { accessToken, refreshToken }
    // }

    // private async validateUser(dto: AuthDto) {
    //     const user = await this.usersRepository
    //     .createQueryBuilder('user')
    //     .leftJoinAndSelect('user.userType', 'userType')
    //     .where('user.email = :email', { email: dto.email })
    //     .getOne();
    //     console.log('user',user)

    //     if (!user) throw new NotFoundException('שם משתמש/סיסמה לא נכונים.')

    //     const isValid = await verify(user.password, dto.password)

    //     if (!isValid) throw new UnauthorizedException('שם משתמש/סיסמה לא נכונים.')

    //     return user
    // }
}
