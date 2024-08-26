import {
	Body,
	Controller,
	Get,
	Param,
	Post,
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
		const isDevelopment = process.env.STAGE === 'dev';
		res.cookie('accessToken', loginResult.accessToken, {
		  httpOnly: false, // Allow access from JavaScript
		  secure: false,
		  sameSite: 'strict',
		});
	  
		res.cookie('refreshToken', loginResult.refreshToken, {
		  httpOnly: false,
		  secure: false,
		  sameSite:'strict',
		});
	  
		delete loginResult.accessToken;
		delete loginResult.refreshToken;
		console.log('Login result after transformation:', loginResult);
		return res.send({
		  ...loginResult,
		});
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
	async accessTOken(@Body() dto: {refreshToken: string}, @Res() res: Response) {
		const loginResult = await this.authService.getNewTokens(dto.refreshToken);
		const isDevelopment = process.env.STAGE === 'dev';
		res.cookie('accessToken', loginResult.accessToken, {
		  httpOnly: !isDevelopment,
		  secure: !isDevelopment,
		  sameSite: isDevelopment ? 'lax' : 'strict',
		});
	  
		res.cookie('refreshToken', loginResult.refreshToken, {
		  httpOnly: !isDevelopment,
		  secure: !isDevelopment,
		  sameSite: isDevelopment ? 'lax' : 'strict',
		});
		delete loginResult.accessToken;
		delete loginResult.refreshToken;
	  
		console.log('Login result after transformation:', loginResult);
		return res.send({
		  ...loginResult,
		});
	}


	
}
