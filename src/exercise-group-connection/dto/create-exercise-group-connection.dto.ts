import { IsArray, IsNumber, IsString } from "class-validator"
import { AuthEntity } from "src/auth/entities/auth.entity"

export class CreateExerciseGroupConnectionDto {

    @IsString()
    groupUuid: string

    @IsString()
    exerciseTypeId: string

    @IsNumber()
    exerciseId: number

    @IsNumber()
    teacherId: number

    @IsString()
    fromDate: Date

    @IsString()
    toDate: Date

    @IsString()
    time: string

    @IsString()
    toTime: string

    @IsArray()
    students: AuthEntity[]
}
