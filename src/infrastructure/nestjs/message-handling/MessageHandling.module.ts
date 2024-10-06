import { Module } from '@nestjs/common';
import { NestMessageHandlingController } from './NestMessageHandlingController';
import { IntentDetectionModule } from '../intent-detection/IntentDetection.module';
import { FlowManagementModule } from '../flow-management/FlowManagement.module';
import { ContextManagementModule } from '../context-management/ContextManagement.module';
import { NestMessageHandlingService } from './NestMessageHandlingService';

@Module({
  imports: [
    IntentDetectionModule,
    FlowManagementModule,
    ContextManagementModule,
  ],
  controllers: [NestMessageHandlingController],
  providers: [NestMessageHandlingService],
  exports: [NestMessageHandlingService],
})
export class MessageHandlingModule {}
