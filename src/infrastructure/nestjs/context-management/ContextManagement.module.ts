import { Module } from '@nestjs/common';
import { NestContextManagementController } from './NestContextManagementController';
import { NestContextManagementService } from './NestContextManagementService';
import { StorageModule } from '../storage/Storage.module';

@Module({
  imports: [StorageModule],
  controllers: [NestContextManagementController],
  providers: [NestContextManagementService],
  exports: [NestContextManagementService],
})
export class ContextManagementModule {}
