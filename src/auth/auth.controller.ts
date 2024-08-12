import {
	Body,
	Controller,
	Get,
	Param,
	Post,
} from '@nestjs/common'
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Role } from 'src/enums/role.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	
  	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@Get('/allUsers/:type/:school')
	async getUserByTypeAndSchool(@Param('type') type: Role, @Param('school') schoolId: string){
		return this.authService.getUserByTypeAndSchool(type,schoolId);
	}

	@Get('/mail/:userId')
	async getUsers(@Param('userId') userId: string){
		return this.authService.getUsers(+userId)
	}

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
	
}
