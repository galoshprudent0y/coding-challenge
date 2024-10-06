import { IValidator } from '../shared/IValidator';
import { IMessageHandlingService } from '@domain/message-handling/MessageHandling.service';

export interface IMessageHandlingController {
  sendMessage(messageDto: unknown): Promise<{ response: string }>;
}

export type MessageDto = {
  userId: string;
  message: string;
};

export class MessageHandlingController implements IMessageHandlingController {
  constructor(
    private readonly messageHandlingService: IMessageHandlingService,
    private readonly messageValidator: IValidator<MessageDto>,
  ) {}

  async sendMessage(messageDto: unknown): Promise<{ response: string }> {
    const validatedMessage = this.messageValidator.validate(messageDto);
    const response = await this.messageHandlingService.processMessage(
      validatedMessage.userId,
      validatedMessage.message,
    );
    return { response };
  }
}
