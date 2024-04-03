import { PartialType } from '@nestjs/swagger';
import { CreateConfirmationDto } from './create-confirmation.dto';

export class UpdateConfirmationDto extends PartialType(CreateConfirmationDto) {}
