import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  IMessageHandlingController,
  MessageDto,
  MessageHandlingController,
} from '@domain/message-handling/MessageHandling.controller';
import { ZodValidator } from '../../validators/ZodValidator';
import { z } from 'zod';
import { NestMessageHandlingService } from './NestMessageHandlingService';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

const MessageSchema = z.object({
  userId: z.string().nonempty('User ID is required'),
  message: z.string().nonempty('Message is required'),
});

@Controller()
@UseGuards(JwtAuthGuard)
export class NestMessageHandlingController
  implements IMessageHandlingController
{
  private domainController: MessageHandlingController;

  constructor(messageHandlingService: NestMessageHandlingService) {
    // @ts-ignore
    const messageValidator = new ZodValidator<MessageDto>(MessageSchema);
    this.domainController = new MessageHandlingController(
      messageHandlingService,
      messageValidator,
    );
  }

  @Post('sendMessage')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() messageDto: unknown) {
    return this.domainController.sendMessage(messageDto);
  }
}
