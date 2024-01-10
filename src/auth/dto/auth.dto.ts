import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator'
export class AuthDto {
	@IsEmail()
	email: string
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	password: string
}