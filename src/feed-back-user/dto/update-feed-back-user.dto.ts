import { PartialType } from '@nestjs/swagger';
import { CreateFeedBackUserDto } from './create-feed-back-user.dto';

export class UpdateFeedBackUserDto extends PartialType(CreateFeedBackUserDto) {}
