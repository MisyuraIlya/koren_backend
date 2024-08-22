import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentHistoryDto {
    @IsOptional()
    @IsBoolean()
    isDone: boolean;

    @IsOptional()
    @IsNumber()
    exerciseId:number
}
