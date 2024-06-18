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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@Get('/allUsers/:type/:school')
	async getUserByTypeAndSchool(@Param('type') type: Role, @Param('school') schoolId: string){
		return this.authService.getUserByTypeAndSchool(type,schoolId);
	}

	@Get('/mail')
	async getUsers(){
		return this.authService.getUsers()
	}
}
