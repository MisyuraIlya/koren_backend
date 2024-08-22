import { IsNumber, IsOptional } from "class-validator"

export class CreateStudentHistoryDto {

    @IsNumber()
    studentId: number

    @IsNumber()
    exerciseId: number
}
