import { PartialType } from '@nestjs/swagger';
import { CreateMailChatDto } from './create-mail-chat.dto';

export class UpdateMailChatDto extends PartialType(CreateMailChatDto) {}
