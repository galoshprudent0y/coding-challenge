import { Module } from '@nestjs/common';
import { NestIntentDetectionController } from './NestIntentDetectionController';
import { NestIntentDetectionService } from './NestIntentDetectionService';

@Module({
  controllers: [NestIntentDetectionController],
  providers: [NestIntentDetectionService],
  exports: [NestIntentDetectionService],
})
export class IntentDetectionModule {}
