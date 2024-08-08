import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	password: string


	@IsOptional()
	@IsString()
	firstName: string

	@IsOptional()
	@IsString()
	lastName: string

	@IsOptional()
	@IsBoolean()
	isAdmin: boolean

	@IsOptional()
	@IsString()
	role: string
}
