import { IMessageHandlingService } from '@domain/message-handling/MessageHandling.service';
import {
  MessageDto,
  MessageHandlingController,
} from '@domain/message-handling/MessageHandling.controller';
import { IValidator } from '@domain/shared/IValidator';

describe('MessageHandlingController', () => {
  let messageHandlingController: MessageHandlingController;
  let mockMessageHandlingService: jest.Mocked<IMessageHandlingService>;
  let mockMessageValidator: jest.Mocked<IValidator<MessageDto>>;

  beforeEach(() => {
    mockMessageHandlingService = {
      processMessage: jest.fn(),
    };
    mockMessageValidator = {
      validate: jest.fn(),
    };

    messageHandlingController = new MessageHandlingController(
      mockMessageHandlingService,
      mockMessageValidator,
    );
  });

  describe('sendMessage', () => {
    it('should validate the message and return the processed response', async () => {
      const messageDto = { userId: 'user1', message: 'Hello' };
      const validatedMessage = { userId: 'user1', message: 'Hello' };
      const processedResponse = 'Processed message response';

      mockMessageValidator.validate.mockReturnValue(validatedMessage);
      mockMessageHandlingService.processMessage.mockResolvedValue(
        processedResponse,
      );

      const result = await messageHandlingController.sendMessage(messageDto);

      expect(mockMessageValidator.validate).toHaveBeenCalledWith(messageDto);
      expect(mockMessageHandlingService.processMessage).toHaveBeenCalledWith(
        'user1',
        'Hello',
      );
      expect(result).toEqual({ response: processedResponse });
    });

    it('should throw an error if validation fails', async () => {
      const invalidMessageDto = { userId: 'user1' }; // Missing 'message' field
      const validationError = new Error('Validation failed');

      mockMessageValidator.validate.mockImplementation(() => {
        throw validationError;
      });

      await expect(
        messageHandlingController.sendMessage(invalidMessageDto),
      ).rejects.toThrow(validationError);
      expect(mockMessageValidator.validate).toHaveBeenCalledWith(
        invalidMessageDto,
      );
      expect(mockMessageHandlingService.processMessage).not.toHaveBeenCalled();
    });
  });
});
