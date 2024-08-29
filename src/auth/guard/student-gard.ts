import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "../entities/auth.entity";
import { Role } from "src/enums/role.enum";
import { ConfigService } from "@nestjs/config";
import { extractAndVerifyTokenFromCookie } from "./token.util";

@Injectable()
export class StudentRoleGuard implements CanActivate {

    constructor(
        @InjectRepository(AuthEntity)
        private readonly userRepository: Repository<AuthEntity>,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const cookies = request.headers.cookie;

        const decodedToken = extractAndVerifyTokenFromCookie(cookies, this.configService);
        const user = await this.userRepository.findOne({
            where: { id: Number(decodedToken.id) },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        if (user.role !== Role.Student) {
            throw new HttpException('Insufficient privileges', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}
