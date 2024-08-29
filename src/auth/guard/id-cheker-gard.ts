import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "../entities/auth.entity";
import { ConfigService } from "@nestjs/config";
import { extractAndVerifyTokenFromCookie } from "./token.util";

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
        const cookies = request.headers.cookie;

        const decodedToken = extractAndVerifyTokenFromCookie(cookies, this.configService);
        const [path] = url.split('?');
        const urlParts = path.split('/');
        const urlId = urlParts[urlParts.length - 1];

        if (urlId != decodedToken.id) {
            throw new BadRequestException('User ID does not match');
        }

        const user = await this.userRepository.findOne({
            where: { id: Number(decodedToken.id) },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }
}
