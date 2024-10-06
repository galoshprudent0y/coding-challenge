import { IValidator } from '../shared/IValidator';
import { IIntentDetectionService } from '@domain/intent-detection/IntentDetection.service';

export type DetectIntentDto = {
  message: string;
};

export interface IIntentDetectionController {
  detectIntent(detectIntentDto: unknown): Promise<{ intent: string }>;
}

export class IntentDetectionController implements IIntentDetectionController {
  constructor(
    private readonly intentDetectionService: IIntentDetectionService,
    private readonly detectIntentValidator: IValidator<DetectIntentDto>,
  ) {}

  async detectIntent(detectIntentDto: unknown): Promise<{ intent: string }> {
    const { message } = this.detectIntentValidator.validate(detectIntentDto);
    const intent = await this.intentDetectionService.detectIntent(message);
    return { intent };
  }
}
