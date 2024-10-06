import { IStorageService } from './IStorageService';

export interface IContextManagementService {
  setContext(userId: string, context: any): Promise<void>;

  getContext(userId: string): Promise<any>;

  updateContext(userId: string, updates: any): Promise<void>;
}

export class ContextManagementService implements IContextManagementService {
  constructor(private readonly storageService: IStorageService) {}

  async setContext(userId: string, context: any): Promise<void> {
    await this.storageService.set(`context:${userId}`, JSON.stringify(context));
  }

  async getContext(userId: string): Promise<any> {
    const context = await this.storageService.get(`context:${userId}`);
    return context ? JSON.parse(context) : null;
  }

  async updateContext(userId: string, updates: any): Promise<void> {
    const currentContext = await this.getContext(userId);
    const updatedContext = { ...currentContext, ...updates };
    await this.setContext(userId, updatedContext);
  }
}
