import { Injectable } from '@nestjs/common';
import {
  IIntentDetectionService,
  IntentDetectionService,
} from '@domain/intent-detection/IntentDetection.service';

@Injectable()
export class NestIntentDetectionService implements IIntentDetectionService {
  private domainService: IntentDetectionService;

  constructor() {
    this.domainService = new IntentDetectionService();
  }

  async detectIntent(message: string): Promise<string> {
    return this.domainService.detectIntent(message);
  }
}
