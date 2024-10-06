import { Injectable, Inject } from '@nestjs/common';
import {
  ContextManagementService,
  IContextManagementService,
} from '@domain/context-management/ContextManagement.service';
import { IStorageService } from '../../../domain/context-management/IStorageService';
import { STORAGE_SERVICE } from '../storage/Storage.module';

@Injectable()
export class NestContextManagementService implements IContextManagementService {
  private domainService: ContextManagementService;

  constructor(@Inject(STORAGE_SERVICE) storageService: IStorageService) {
    this.domainService = new ContextManagementService(storageService);
  }

  async setContext(userId: string, context: any): Promise<void> {
    await this.domainService.setContext(userId, context);
  }

  async getContext(userId: string): Promise<any> {
    return this.domainService.getContext(userId);
  }

  async updateContext(userId: string, updates: any): Promise<void> {
    await this.domainService.updateContext(userId, updates);
  }
}
