import { AuthEntity } from "src/auth/entities/auth.entity";
import { MailTypeEnum } from "src/enums/mail.enum";

export class CreateMailDto {
    sendTo: string[]
    title: string
    description: string
    type?: MailTypeEnum
    exerciseId?: number
}
