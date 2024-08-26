import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateManualGradeDto {

    @IsNumber()
    exerciseId: number

    @IsNumber()
    grade: number

    @IsNumber()
    studentAnswerId: number
}
