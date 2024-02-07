import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStudentHistoryDto {
    @IsOptional()
    @IsBoolean()
    isDone: boolean;
}
