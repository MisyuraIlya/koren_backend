import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const excludePaths = [
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/register',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/login',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/login/access-token',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/initial',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/fetchCourses',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/fetchExercises',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/api/engine',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/api/objective',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/stepOne',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/stepTwo',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/stepThree'
    ]; // List of paths to exclude from JWT validation

    if (excludePaths.includes(request.path)) {
      return true; 
    }

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, jwtSecret); 
      request.user = decoded; 
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
