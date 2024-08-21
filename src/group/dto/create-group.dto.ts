import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GroupPrivilageEnum, GroupTypeEnum } from "src/enums/gourpType.enum";

export class CreateGroupDto {
    @IsNotEmpty()
    @IsArray()
    classes: string[]

    @IsOptional()
    @IsArray()
    teachers: string[]

    @IsOptional()
    @IsArray()
    students: string[]

    @IsOptional()
    @IsString()
    title: string

    @IsNotEmpty()
    role: GroupTypeEnum

    @IsNotEmpty()
    privilageType: GroupPrivilageEnum

    @IsBoolean()
    isUnique: boolean
}
