import { PartialType } from '@nestjs/swagger';
import { CreateFeedBackItemDto } from './create-feed-back-item.dto';

export class UpdateFeedBackItemDto extends PartialType(CreateFeedBackItemDto) {}
