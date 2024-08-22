import { IsArray, IsOptional, IsString } from "class-validator"
import { AuthEntity } from "src/auth/entities/auth.entity"

export class CreateExerciseGroupAnswerDto {

    @IsString()
    answerType: string

    @IsArray()
    students: AuthEntity[]

    @IsString()
    @IsOptional()
    dueDate?: Date

    @IsString()
    @IsOptional()
    time?: string

}
