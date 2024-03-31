import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';
import { School } from 'src/school/entities/school.entity';
import { Role } from 'src/enums/role.enum';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
        @InjectRepository(School)
        private readonly schoolRepository: Repository<School>,
    ){}

    async login(dto: AuthDto) {
        const user = await this.authRepository.findOne({
            where:{email:dto.email, password: dto.password},
            relations: ['school']
        })

        if (!user) throw new UnauthorizedException('שם משתמש/סיסמה לא נכונים.')

        return user;

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
}
