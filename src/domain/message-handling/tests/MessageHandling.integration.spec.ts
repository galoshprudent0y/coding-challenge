import { IContextManagementService } from '@domain/context-management/ContextManagement.service';
import { IFlowManagementService } from '@domain/flow-management/FlowManagement.service';
import { IIntentDetectionService } from '@domain/intent-detection/IntentDetection.service';
import {
  MessageDto,
  MessageHandlingController,
} from '@domain/message-handling/MessageHandling.controller';
import { MessageHandlingService } from '@domain/message-handling/MessageHandling.service';
import { IValidator } from '@domain/shared/IValidator';

describe('MessageHandling Integration', () => {
  let messageHandlingController: MessageHandlingController;
  let messageHandlingService: MessageHandlingService;
  let mockIntentDetectionService: jest.Mocked<IIntentDetectionService>;
  let mockFlowManagementService: jest.Mocked<IFlowManagementService>;
  let mockContextManagementService: jest.Mocked<IContextManagementService>;
  let mockMessageValidator: jest.Mocked<IValidator<MessageDto>>;

  beforeEach(() => {
    mockIntentDetectionService = {
      detectIntent: jest.fn(),
    };
    mockFlowManagementService = {
      setFlow: jest.fn(),
      getFlow: jest.fn(),
      handleNormalFlow: jest.fn(),
      initiateCheckInFlow: jest.fn(),
      continueFlow: jest.fn(),
    };
    mockContextManagementService = {
      setContext: jest.fn(),
      getContext: jest.fn(),
      updateContext: jest.fn(),
    };
    mockMessageValidator = {
      validate: jest.fn(),
    };

    messageHandlingService = new MessageHandlingService(
      mockIntentDetectionService,
      mockFlowManagementService,
      mockContextManagementService,
    );

    messageHandlingController = new MessageHandlingController(
      messageHandlingService,
      mockMessageValidator,
    );
  });

  it('should process a message through the entire flow', async () => {
    const messageDto = {
      userId: 'user1',
      message: 'What are your office hours?',
    };
    const validatedMessage = {
      userId: 'user1',
      message: 'What are your office hours?',
    };

    mockMessageValidator.validate.mockReturnValue(validatedMessage);
    mockIntentDetectionService.detectIntent.mockResolvedValue('FAQ');
    mockFlowManagementService.getFlow.mockResolvedValue('NORMAL');

    const result = await messageHandlingController.sendMessage(messageDto);

    expect(mockMessageValidator.validate).toHaveBeenCalledWith(messageDto);
    expect(mockIntentDetectionService.detectIntent).toHaveBeenCalledWith(
      'What are your office hours?',
    );
    expect(mockFlowManagementService.getFlow).toHaveBeenCalledWith('user1');
    expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
      'user1',
      expect.objectContaining({
        lastMessage: 'What are your office hours?',
        lastIntent: 'FAQ',
      }),
    );
    expect(result.response).toContain('Our office hours are 9 AM to 5 PM');
  });

  it('should handle SUICIDE_RISK intent', async () => {
    const messageDto = {
      userId: 'user1',
      message: 'I feel like ending it all',
    };
    const validatedMessage = {
      userId: 'user1',
      message: 'I feel like ending it all',
    };

    mockMessageValidator.validate.mockReturnValue(validatedMessage);
    mockIntentDetectionService.detectIntent.mockResolvedValue('SUICIDE_RISK');
    mockFlowManagementService.getFlow.mockResolvedValue('NORMAL');
    mockFlowManagementService.continueFlow.mockResolvedValue('Flow response');

    const result = await messageHandlingController.sendMessage(messageDto);

    expect(mockMessageValidator.validate).toHaveBeenCalledWith(messageDto);
    expect(mockIntentDetectionService.detectIntent).toHaveBeenCalledWith(
      'I feel like ending it all',
    );
    expect(mockFlowManagementService.getFlow).toHaveBeenCalledWith('user1');
    expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
      'user1',
      expect.objectContaining({
        lastMessage: 'I feel like ending it all',
        lastIntent: 'SUICIDE_RISK',
      }),
    );
    expect(result.response).toContain(
      "I'm really sorry you're feeling this way",
    );
    expect(result.response).toContain('Flow response');
  });

  it('should handle unknown intent', async () => {
    const messageDto = { userId: 'user1', message: 'Random message' };
    const validatedMessage = { userId: 'user1', message: 'Random message' };

    mockMessageValidator.validate.mockReturnValue(validatedMessage);
    mockIntentDetectionService.detectIntent.mockResolvedValue('UNKNOWN');
    mockFlowManagementService.getFlow.mockResolvedValue('NORMAL');
    mockFlowManagementService.continueFlow.mockResolvedValue(
      'Default flow response',
    );

    const result = await messageHandlingController.sendMessage(messageDto);

    expect(mockMessageValidator.validate).toHaveBeenCalledWith(messageDto);
    expect(mockIntentDetectionService.detectIntent).toHaveBeenCalledWith(
      'Random message',
    );
    expect(mockFlowManagementService.getFlow).toHaveBeenCalledWith('user1');
    expect(mockFlowManagementService.continueFlow).toHaveBeenCalledWith(
      'user1',
      'Random message',
    );
    expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
      'user1',
      expect.objectContaining({
        lastMessage: 'Random message',
        lastIntent: 'UNKNOWN',
      }),
    );
    expect(result.response).toBe('Default flow response');
  });
  it('should continue flow for unknown intent', async () => {
    const userId = 'user123';
    const message = 'Hello, how are you?';
    const intent = 'UNKNOWN';
    const flowResponse = 'This is a flow response';

    mockIntentDetectionService.detectIntent.mockResolvedValue(intent);
    mockFlowManagementService.continueFlow.mockResolvedValue(flowResponse);

    const result = await messageHandlingService.processMessage(userId, message);

    expect(mockIntentDetectionService.detectIntent).toHaveBeenCalledWith(
      message,
    );
    expect(mockFlowManagementService.continueFlow).toHaveBeenCalledWith(
      userId,
      message,
    );
    expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
      userId,
      {
        lastMessage: message,
        lastResponse: flowResponse,
        lastIntent: intent,
      },
    );
    expect(result).toBe(flowResponse);
  });
});
