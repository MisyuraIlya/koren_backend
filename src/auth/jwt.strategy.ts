import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthEntity } from './entities/auth.entity'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private readonly usersRepository: Repository<AuthEntity>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

    async validate({ id }: Pick<AuthEntity, 'id'>) {
        return this.usersRepository.findOne({
          where: {
            id: id,
          },
        });
    }
}
