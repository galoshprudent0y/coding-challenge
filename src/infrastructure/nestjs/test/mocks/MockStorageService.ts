import { Injectable } from '@nestjs/common';
import { IStorageService } from '../../../../domain/context-management/IStorageService';

@Injectable()
export class MockStorageService implements IStorageService {
  private storage: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

// Export the token used in the real StorageModule
export const STORAGE_SERVICE = 'STORAGE_SERVICE';
