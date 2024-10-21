import { IsString } from "class-validator"

export class CreateFeedBackItemDto {
    @IsString()
    title: string

    @IsString()
    type: string
}
