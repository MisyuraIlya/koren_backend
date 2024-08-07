import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "../entities/auth.entity";

@Injectable()
export class AdminRoleGUard implements CanActivate {

    constructor(
        @InjectRepository(AuthEntity)
        private readonly userRepository: Repository<AuthEntity>,
      ) {}

      
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const bearerToken = request.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
          throw new HttpException('Invalid or missing bearer token', HttpStatus.UNAUTHORIZED);
        }

        const token = bearerToken.split(" ")[1];

        try {
            const decodedToken = jwt.verify(token, '0asdasd') as { id: string };
            
            const {id}  = decodedToken;
            const user = await this.userRepository.findOne({
                where: { id: Number(id) },
            });
            if (!user) {
              throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }


            if (!user.isAdmin) {
                throw new HttpException('Insufficient privileges', HttpStatus.FORBIDDEN);
              }

      
          } catch (error) {
            throw new HttpException('אין הרשאה לסוג פעולה זו', HttpStatus.UNAUTHORIZED);
          }
      
        return true;
    }
}