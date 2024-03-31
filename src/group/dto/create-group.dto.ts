import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { GroupPrivilageEnum, GroupTypeEnum } from "src/enums/gourpType.enum";

export class CreateGroupDto {
    @IsNotEmpty()
    @IsArray()
    classes: string[]

    @IsArray()
    teachers: string[]

    @IsArray()
    students: string[]

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    role: GroupTypeEnum

    @IsNotEmpty()
    privilageType: GroupPrivilageEnum

    @IsBoolean()
    isUnique: boolean
}
