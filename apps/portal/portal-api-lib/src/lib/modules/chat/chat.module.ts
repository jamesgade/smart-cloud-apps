import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatQuestion, ChatSession, ChatResponse } from './entities';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatQuestion, ChatSession, ChatResponse]),
    AuthModule
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}


