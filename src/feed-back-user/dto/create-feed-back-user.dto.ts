import { IsString } from "class-validator";
import { AuthEntity } from "src/auth/entities/auth.entity";

export class CreateFeedBackUserDto {

    @IsString()
    title: string | null;

    user: AuthEntity;

    @IsString()
    uuid: string
}
