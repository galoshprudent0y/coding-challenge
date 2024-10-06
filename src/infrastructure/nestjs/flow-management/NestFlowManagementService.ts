import { Injectable, Inject } from '@nestjs/common';
import {
  FlowManagementService,
  FlowType,
  IFlowManagementService,
} from '@domain/flow-management/FlowManagement.service';
import { NestContextManagementService } from '../context-management/NestContextManagementService';

@Injectable()
export class NestFlowManagementService implements IFlowManagementService {
  private domainService: FlowManagementService;

  constructor(contextManagementService: NestContextManagementService) {
    this.domainService = new FlowManagementService(contextManagementService);
  }

  async setFlow(userId: string, flowType: FlowType): Promise<void> {
    return this.domainService.setFlow(userId, flowType);
  }

  async getFlow(userId: string): Promise<FlowType> {
    return this.domainService.getFlow(userId);
  }

  async handleNormalFlow(userId: string, message: string): Promise<string> {
    return this.domainService.handleNormalFlow(userId, message);
  }

  async initiateCheckInFlow(userId: string): Promise<string> {
    return this.domainService.initiateCheckInFlow(userId);
  }

  async continueFlow(userId: string, message: string): Promise<string> {
    return this.domainService.continueFlow(userId, message);
  }
}
