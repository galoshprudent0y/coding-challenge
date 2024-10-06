import { Module } from '@nestjs/common';
import { NestFlowManagementController } from './NestFlowManagementController';
import { NestFlowManagementService } from './NestFlowManagementService';
import { ContextManagementModule } from '../context-management/ContextManagement.module';

@Module({
  imports: [ContextManagementModule],
  controllers: [NestFlowManagementController],
  providers: [NestFlowManagementService],
  exports: [NestFlowManagementService],
})
export class FlowManagementModule {}
