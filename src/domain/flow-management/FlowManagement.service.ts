import { IContextManagementService } from '@domain/context-management/ContextManagement.service';

export type FlowType = 'NORMAL' | 'CHECK_IN';

export interface IFlowManagementService {
  setFlow(userId: string, flowType: FlowType): Promise<void>;

  getFlow(userId: string): Promise<FlowType>;

  handleNormalFlow(userId: string, message: string): Promise<string>;

  initiateCheckInFlow(userId: string): Promise<string>;

  continueFlow(userId: string, message: string): Promise<string>;
}

export class FlowManagementService implements IFlowManagementService {
  constructor(
    private readonly contextManagementService: IContextManagementService,
  ) {}

  async setFlow(userId: string, flowType: FlowType): Promise<void> {
    await this.contextManagementService.updateContext(userId, {
      currentFlow: flowType,
    });
  }

  async getFlow(userId: string): Promise<FlowType> {
    const context = await this.contextManagementService.getContext(userId);
    return context?.currentFlow || 'NORMAL';
  }

  async handleNormalFlow(userId: string, message: string): Promise<string> {
    const context = await this.contextManagementService.getContext(userId);
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('anxious')) {
      return "I'm sorry to hear that. Can you tell me more about it?";
    } else if (lowercaseMessage.includes('stressed')) {
      return 'Stress can be tough. Have you tried any relaxation techniques?';
    } else if (
      lowercaseMessage.includes('happy') ||
      lowercaseMessage.includes('good')
    ) {
      return "I'm glad to hear you're feeling good! What's been going well for you lately?";
    } else if (
      lowercaseMessage.includes('sad') ||
      lowercaseMessage.includes('depressed')
    ) {
      return "I'm sorry you're feeling down. Remember, it's okay to have these feelings. Would you like to talk more about what's bothering you?";
    } else {
      return "I'm here to listen and support you. How can I help you today?";
    }
  }

  async initiateCheckInFlow(userId: string): Promise<string> {
    await this.setFlow(userId, 'CHECK_IN');
    return `Hi! How are you doing today?`;
  }

  async continueFlow(userId: string, message: string): Promise<string> {
    const currentFlow = await this.getFlow(userId);
    if (currentFlow === 'CHECK_IN') {
      return this.continueCheckInFlow(userId, message);
    } else {
      return this.handleNormalFlow(userId, message);
    }
  }

  private async continueCheckInFlow(
    userId: string,
    message: string,
  ): Promise<string> {
    const context = await this.contextManagementService.getContext(userId);
    const lowercaseMessage = message.toLowerCase();

    if (!context.checkInStep) {
      // First response to "How are you doing today?"
      let response: string;
      if (
        lowercaseMessage.includes('good') ||
        lowercaseMessage.includes('great') ||
        lowercaseMessage.includes('fine')
      ) {
        response =
          "That's wonderful to hear! Is there anything specific that's made your day good so far?";
      } else if (
        lowercaseMessage.includes('bad') ||
        lowercaseMessage.includes('not good') ||
        lowercaseMessage.includes('terrible')
      ) {
        response =
          "I'm sorry to hear that. Would you like to talk about what's bothering you?";
      } else {
        response =
          "Thank you for sharing. Could you tell me more about how you're feeling?";
      }
      await this.contextManagementService.updateContext(userId, {
        checkInStep: 1,
      });
      return response;
    } else {
      // Follow-up response
      await this.setFlow(userId, 'NORMAL'); // End check-in flow
      return "Thank you for sharing that with me. I'm here to support you. Is there anything specific you'd like to talk about or get help with today?";
    }
  }
}
