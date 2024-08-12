import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const excludePaths = [
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/register',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/login',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/auth/login/access-token',
      '/9dee9c0c-d2e5-44c0-891a-1e446bece049/initial'
    ]; // List of paths to exclude from JWT validation
    if (excludePaths.includes(request.path)) {
      return true; 
    }

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, '0asdasd'); 
      request.user = decoded; 
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
