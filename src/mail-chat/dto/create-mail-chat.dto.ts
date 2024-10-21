import { IsString } from "class-validator";

export class CreateMailChatDto {
    @IsString()
    description: string
}
