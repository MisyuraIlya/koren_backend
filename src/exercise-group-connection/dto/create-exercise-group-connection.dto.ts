import { AuthEntity } from "src/auth/entities/auth.entity"

export class CreateExerciseGroupConnectionDto {

    groupUuid: string
    exerciseTypeId: string
    exerciseId: string
    teacherId: string
    fromDate: Date
    toDate: Date
    time: string
    students: AuthEntity[]
}
