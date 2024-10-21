import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { MailChatModule } from 'src/mail-chat/mail-chat.module';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mail, AuthEntity,ExerciseEntity]), MailChatModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
