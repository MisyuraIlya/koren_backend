import { Module } from '@nestjs/common';
import { MailChatService } from './mail-chat.service';
import { MailChatController } from './mail-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from 'src/mail/entities/mail.entity';
import { MailChat } from './entities/mail-chat.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mail, MailChat, AuthEntity])],
  controllers: [MailChatController],
  providers: [MailChatService],
  exports: [MailChatService]
})
export class MailChatModule {}
