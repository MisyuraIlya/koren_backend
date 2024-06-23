import { IsNumber } from 'class-validator';

export class UpdateTeacherGrade {
    @IsNumber()
    teacherGrade: number

    isFinalGrade?: boolean
}
