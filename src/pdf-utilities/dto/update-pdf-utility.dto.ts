import { PartialType } from '@nestjs/swagger';
import { CreatePdfUtilityDto } from './create-pdf-utility.dto';

export class UpdatePdfUtilityDto extends PartialType(CreatePdfUtilityDto) {}
