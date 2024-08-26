import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "../entities/auth.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IdCheckerGuard implements CanActivate {

    constructor(
        @InjectRepository(AuthEntity)
        private readonly userRepository: Repository<AuthEntity>,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const url = request.url;
        const bearerToken = request.headers.authorization;

        if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
            throw new HttpException('Invalid or missing bearer token', HttpStatus.UNAUTHORIZED);
        }

        const token = bearerToken.split(" ")[1];
        try {
            const decodedToken = jwt.verify(token, this.configService.get<string>('JWT_SECRET')) as { id: string };
            const { id: userId } = decodedToken;
            const [path] = url.split('?');
            const urlParts = path.split('/');
            const urlId = urlParts[urlParts.length - 1];
            if (urlId != userId) {
                throw new BadRequestException('User ID does not match');
            }

            const user = await this.userRepository.findOne({
                where: { id: Number(userId) },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }

        } catch (error) {
            console.log('GUARD ERROR', error);
            throw new HttpException('Unauthorized or token error', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }
}
