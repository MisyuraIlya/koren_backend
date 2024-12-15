import { PartialType } from '@nestjs/swagger';
import { CreateHighlightDto } from './create-highlight.dto';

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {}
