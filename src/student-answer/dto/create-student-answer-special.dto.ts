import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, isNumber } from 'class-validator';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';

export class CreateStudentAnswerSpeicalDto {

    @IsString()
    @IsOptional()
    value: string | null;

    @IsArray()
    @IsOptional()
    objectives: Array<ObjectiveEntity> | null

    @IsString()
    @IsOptional()
    objectiveId: number;

}
