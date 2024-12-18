import { PartialType } from '@nestjs/swagger';
import { CreateColorHighlightDto } from './create-color-highlight.dto';

export class UpdateColorHighlightDto extends PartialType(CreateColorHighlightDto) {}
