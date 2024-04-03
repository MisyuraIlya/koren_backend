import { IsNumber } from "class-validator";

export class CreateConfirmationDto {
    @IsNumber()
    userId: number

    @IsNumber()
    courseId: number
}
