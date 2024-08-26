import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "../entities/auth.entity";
import { Role } from "src/enums/role.enum";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TeacherRoleGuard implements CanActivate {

    constructor(
        @InjectRepository(AuthEntity)
        private readonly userRepository: Repository<AuthEntity>,
        private readonly configService: ConfigService
      ) {}

      
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const bearerToken = request.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
          throw new HttpException('Invalid or missing bearer token', HttpStatus.UNAUTHORIZED);
        }

        const token = bearerToken.split(" ")[1];
        try {
            const decodedToken = jwt.verify(token, this.configService.get<string>('JWT_SECRET')) as { id: string };
            const {id}  = decodedToken;
            const user = await this.userRepository.findOne({
                where: { id: Number(id) },
            });

            if (!user) {
              throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }


            if (user.role !== Role.Teacher) {
                throw new HttpException('Insufficient privileges', HttpStatus.FORBIDDEN);
              }

      
          } catch (error) {
            console.log('error',error)
            throw new HttpException('אין הרשאה לסוג פעולה זו', HttpStatus.UNAUTHORIZED);
          }
      
        return true;
    }
}