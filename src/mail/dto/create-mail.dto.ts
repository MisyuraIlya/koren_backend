import { AuthEntity } from "src/auth/entities/auth.entity";
import { MailTypeEnum } from "src/enums/mail.enum";

export class CreateMailDto {
    sendTo: number[]
    title: string
    description: string
    type?: MailTypeEnum
}
