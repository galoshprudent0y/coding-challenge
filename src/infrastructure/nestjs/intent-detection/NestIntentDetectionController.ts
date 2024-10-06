import { Controller, Post, Body } from '@nestjs/common';
import { IntentDetectionController } from '@domain/intent-detection/IntentDetection.controller';
import { NestIntentDetectionService } from './NestIntentDetectionService';
import { ZodValidator } from '../../validators/ZodValidator';
import { z } from 'zod';

const DetectIntentSchema = z.object({
  message: z.string().nonempty('Message is required'),
});

@Controller('intent-detection')
export class NestIntentDetectionController {
  private domainController: IntentDetectionController;

  constructor(intentDetectionService: NestIntentDetectionService) {
    const detectIntentValidator = new ZodValidator(DetectIntentSchema);
    this.domainController = new IntentDetectionController(
      intentDetectionService,
      //@ts-ignore
      detectIntentValidator,
    );
  }

  @Post('detect')
  async detectIntent(@Body() detectIntentDto: unknown) {
    return this.domainController.detectIntent(detectIntentDto);
  }
}
