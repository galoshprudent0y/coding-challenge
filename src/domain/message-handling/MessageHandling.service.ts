import { IContextManagementService } from '@domain/context-management/ContextManagement.service';
import { IFlowManagementService } from '@domain/flow-management/FlowManagement.service';
import { IIntentDetectionService } from '@domain/intent-detection/IntentDetection.service';

export interface IMessageHandlingService {
  processMessage(userId: string, message: string): Promise<string>;
}

export class MessageHandlingService implements IMessageHandlingService {
  constructor(
    private readonly intentDetectionService: IIntentDetectionService,
    private readonly flowManagementService: IFlowManagementService,
    private readonly contextManagementService: IContextManagementService,
  ) {}

  async processMessage(userId: string, message: string): Promise<string> {
    const intent = await this.intentDetectionService.detectIntent(message);
    const currentFlow = await this.flowManagementService.getFlow(userId);

    let response: string;

    switch (intent) {
      case 'FAQ':
        response = this.handleFAQ(message);
        break;
      case 'SUICIDE_RISK':
        response = await this.handleSuicideRisk(userId, message);
        break;
      default:
        response = await this.flowManagementService.continueFlow(
          userId,
          message,
        );
    }

    // Update context with the latest message and response
    await this.contextManagementService.updateContext(userId, {
      lastMessage: message,
      lastResponse: response,
      lastIntent: intent,
      currentFlow,
    });

    return response;
  }

  private handleFAQ(message: string): string {
    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('cancel subscription')) {
      return "To cancel your subscription, please visit our FAQ page at https://www.clareandme.com/faq and follow the 'Subscription' instructions.";
    } else if (lowercaseMessage.includes('office hours')) {
      return "Our office hours are 9 AM to 5 PM, Monday through Friday. For more details, please check the 'Contact Us' section on our FAQ page at https://www.clareandme.com/faq.";
    } else if (
      lowercaseMessage.includes('payment') ||
      lowercaseMessage.includes('billing')
    ) {
      return "For questions about payments or billing, please refer to the 'Billing and Payments' section on our FAQ page at https://www.clareandme.com/faq.";
    } else if (
      lowercaseMessage.includes('privacy') ||
      lowercaseMessage.includes('data')
    ) {
      return 'We take your privacy seriously. For information about how we handle your data, please check our Privacy Policy on the FAQ page at https://www.clareandme.com/faq.';
    } else {
      return "For more information on your question, please visit our FAQ page at https://www.clareandme.com/faq. If you can't find the answer there, feel free to ask me and I'll do my best to help.";
    }
  }

  private async handleSuicideRisk(
    userId: string,
    message: string,
  ): Promise<string> {
    const riskResponse =
      "I'm really sorry you're feeling this way. Your safety is very important. Please talk to a mental health professional or contact a crisis hotline right away. Remember, you're not alone, and there are people who can help.";

    // Continue with the previous flow after providing the suicide risk response
    const flowResponse = await this.flowManagementService.continueFlow(
      userId,
      message,
    );

    return `${riskResponse}\n\n${flowResponse}`;
  }
}
