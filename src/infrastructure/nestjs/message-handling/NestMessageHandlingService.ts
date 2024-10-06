import { Injectable } from '@nestjs/common';
import {
  IMessageHandlingService,
  MessageHandlingService,
} from '@domain/message-handling/MessageHandling.service';
import { NestIntentDetectionService } from '../intent-detection/NestIntentDetectionService';
import { NestFlowManagementService } from '../flow-management/NestFlowManagementService';
import { NestContextManagementService } from '../context-management/NestContextManagementService';

@Injectable()
export class NestMessageHandlingService implements IMessageHandlingService {
  private domainService: MessageHandlingService;

  constructor(
    intentDetectionService: NestIntentDetectionService,
    flowManagementService: NestFlowManagementService,
    contextManagementService: NestContextManagementService,
  ) {
    this.domainService = new MessageHandlingService(
      intentDetectionService,
      flowManagementService,
      contextManagementService,
    );
  }

  async processMessage(userId: string, message: string): Promise<string> {
    return this.domainService.processMessage(userId, message);
  }
}
