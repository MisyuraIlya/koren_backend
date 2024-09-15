import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Role } from 'src/enums/role.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthEntity } from './entities/auth.entity';
import * as cookieParser from 'cookie-parser';
import { Response } from 'express';
import { ExcludeTransformInterceptor } from './decorators/ExcludeTransformInterceptor';
import { ResetDto } from './dto/reset.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
	private readonly authService: AuthService
) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@Post('login')
	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@ExcludeTransformInterceptor()
	async login(@Body() dto: AuthDto, @Res() res: Response) {
		const loginResult = await this.authService.login(dto);
		res.cookie('accessToken', loginResult.accessToken, {
		  httpOnly: true, 
		  secure: true,
		  sameSite: 'strict',
		});
	  
		res.cookie('refreshToken', loginResult.refreshToken, {
		  httpOnly: true,
		  secure: true,
		  sameSite:'strict',
		});
	  
		delete loginResult.accessToken;
		delete loginResult.refreshToken;
		return res.send({
		  ...loginResult,
		});
	}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@ExcludeTransformInterceptor()
	@Post('logout')
	async logout(@Res() res: Response) {
		res.cookie('accessToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: new Date(0),
		});

		res.cookie('refreshToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: new Date(0), 
		});

		return res.send({ message: 'Logged out successfully' });
	}


	@SkipThrottle()
	@Get('/allUsers/:type/:school')
	async getUserByTypeAndSchool(@Param('type') type: Role, @Param('school') schoolId: string){
		return this.authService.getUserByTypeAndSchool(type,schoolId);
	}

	
	@Get('/mail/:userId')
	async getUsers(@Param('userId') userId: string){
		return this.authService.getUsers(+userId)
	}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@Post('stepOne')
	async step1(@Body() dto: {mail:string}) {
		return this.authService.step1(dto)
	}

	@Post('stepTwo')
	async step2(@Body() dto: {mail:string, token:string}) {
		return this.authService.step2(dto)
	}

	@Post('stepThree')
	async step3(@Body() dto: {mail:string, password:string, token:string}) {
		return this.authService.step3(dto)
	}

	@Post('updateUser')
	async updateUser(@Body() dto: ResetDto) {
		return this.authService.updateUser(dto)
	}

 @Post('login/access-token')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ExcludeTransformInterceptor()
  async accessToken(@Req() req: Request, @Res() res: Response) {

	const cookies = req.headers['cookie'];
    let accessToken = '';
    let refreshToken = '';
    if (typeof cookies === 'string') {
      const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      accessToken = parsedCookies['accessToken'];
      refreshToken = parsedCookies['refreshToken'];
    }

    const loginResult = await this.authService.getNewTokens(refreshToken);
	res.cookie('accessToken', loginResult.accessToken, {
		httpOnly: true, 
		secure: true,
		sameSite: 'strict',
	});

    delete loginResult.accessToken;
    delete loginResult.refreshToken;

    return res.send({
      ...loginResult,
    });
  }


	
}
