import { HttpException, HttpStatus } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

export interface DecodedToken {
  id: string;
}

export function extractAndVerifyTokenFromCookie(cookie: string, configService: ConfigService): DecodedToken {
    if (!cookie) {
        throw new HttpException('No cookies found', HttpStatus.UNAUTHORIZED);
    }

    const cookies = cookie.split(';').reduce((acc, cookieStr) => {
        const [key, value] = cookieStr.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    const accessToken = cookies['accessToken'];
    if (!accessToken) {
        throw new HttpException('No access token found in cookies', HttpStatus.UNAUTHORIZED);
    }

    try {
        return jwt.verify(accessToken, configService.get<string>('JWT_SECRET')) as DecodedToken;
    } catch (error) {
        throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }
}
