import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
    ){}

    async login(dto: AuthDto) {
        const user = await this.authRepository.findOne({
            where:{email:dto.email, password: dto.password}
        })

        if (!user) throw new UnauthorizedException('שם משתמש/סיסמה לא נכונים.')

        return user;

    }
}
