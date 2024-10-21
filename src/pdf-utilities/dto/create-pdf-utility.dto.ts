import { IsString } from 'class-validator';

export class CreatePdfUtilityDto {
    @IsString()
    title: string;

    @IsString()
    pdf: string;
}
