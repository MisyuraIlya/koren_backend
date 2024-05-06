import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateStudentHistoryDto {
    @IsOptional()
    @IsBoolean()
    isDone: boolean;

    exerciseId:number
}
