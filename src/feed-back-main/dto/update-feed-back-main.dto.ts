import { PartialType } from '@nestjs/swagger';
import { CreateFeedBackMainDto } from './create-feed-back-main.dto';

export class UpdateFeedBackMainDto extends PartialType(CreateFeedBackMainDto) {}
