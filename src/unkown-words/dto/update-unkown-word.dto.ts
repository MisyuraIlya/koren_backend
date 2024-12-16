import { PartialType } from '@nestjs/swagger';
import { CreateUnkownWordDto } from './create-unkown-word.dto';

export class UpdateUnkownWordDto extends PartialType(CreateUnkownWordDto) {}
