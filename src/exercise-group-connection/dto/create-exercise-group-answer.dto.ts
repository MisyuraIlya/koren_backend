import { AuthEntity } from "src/auth/entities/auth.entity"

export class CreateExerciseGroupAnswerDto {
    answerType: string
    students: AuthEntity[]
    dueDate?: Date
    time?: string

}
