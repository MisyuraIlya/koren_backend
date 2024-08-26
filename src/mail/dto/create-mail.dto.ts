import { IsArray, IsNumber, IsString } from "class-validator";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { MailTypeEnum } from "src/enums/mail.enum";

export class CreateMailDto {
    @IsArray()
    sendTo: string[]

    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    type?: MailTypeEnum

    @IsNumber()
    exerciseId?: number
}
