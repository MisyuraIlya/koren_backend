import { IsNumber } from "class-validator";
import { ShieldEnum } from "src/enums/shield.enum";

export class CreateShieldDto {
    @IsNumber()
    userId: number

    @IsNumber()
    courseId: number

    @IsNumber()
    grade: number

    type: ShieldEnum
}
