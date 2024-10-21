import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class ResetDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must contain at least one symboll' })
    password: string;
    

    @IsString()
    uuid: string;

    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string
}
