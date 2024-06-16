import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateManualGradeDto {

    exerciseId: number

    grade: number

    studentAnswerId: number
}
