import { IContextManagementService } from '@domain/context-management/ContextManagement.service';
import { IFlowManagementService } from '@domain/flow-management/FlowManagement.service';
import { IIntentDetectionService } from '@domain/intent-detection/IntentDetection.service';
import { MessageHandlingService } from '@domain/message-handling/MessageHandling.service';

// Assuming FlowType is defined in IFlowManagementService, if not, you need to import it from the correct file
type FlowType = 'NORMAL' | 'CHECK_IN'; // Update this type according to your actual FlowType definition

describe('MessageHandlingService', () => {
  let messageHandlingService: MessageHandlingService;
  let mockIntentDetectionService: jest.Mocked<IIntentDetectionService>;
  let mockFlowManagementService: jest.Mocked<IFlowManagementService>;
  let mockContextManagementService: jest.Mocked<IContextManagementService>;

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

    messageHandlingService = new MessageHandlingService(
      mockIntentDetectionService,
      mockFlowManagementService,
      mockContextManagementService,
    );
  });

  describe('processMessage', () => {
    it('should handle FAQ intent', async () => {
      mockIntentDetectionService.detectIntent.mockResolvedValue('FAQ');
      mockFlowManagementService.getFlow.mockResolvedValue('NORMAL' as FlowType);

      const result = await messageHandlingService.processMessage(
        'user1',
        'What are your office hours?',
      );

      expect(result).toContain('Our office hours are 9 AM to 5 PM');
      expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
        'user1',
        expect.objectContaining({
          lastMessage: 'What are your office hours?',
          lastIntent: 'FAQ',
        }),
      );
    });

    it('should handle SUICIDE_RISK intent', async () => {
      mockIntentDetectionService.detectIntent.mockResolvedValue('SUICIDE_RISK');
      mockFlowManagementService.getFlow.mockResolvedValue('NORMAL' as FlowType);
      mockFlowManagementService.continueFlow.mockResolvedValue('Flow response');

      const result = await messageHandlingService.processMessage(
        'user1',
        'I feel like ending it all',
      );

      expect(result).toContain("I'm really sorry you're feeling this way");
      expect(result).toContain('Flow response');
      expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
        'user1',
        expect.objectContaining({
          lastMessage: 'I feel like ending it all',
          lastIntent: 'SUICIDE_RISK',
        }),
      );
    });

    it('should handle default intent', async () => {
      mockIntentDetectionService.detectIntent.mockResolvedValue('UNKNOWN');
      mockFlowManagementService.getFlow.mockResolvedValue('NORMAL' as FlowType);
      mockFlowManagementService.continueFlow.mockResolvedValue(
        'Default flow response',
      );

      const result = await messageHandlingService.processMessage(
        'user1',
        'Hello',
      );

      expect(result).toBe('Default flow response');
      expect(mockContextManagementService.updateContext).toHaveBeenCalledWith(
        'user1',
        expect.objectContaining({
          lastMessage: 'Hello',
          lastIntent: 'UNKNOWN',
        }),
      );
    });
  });
});
