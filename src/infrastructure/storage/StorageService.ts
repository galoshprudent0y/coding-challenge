import { Redis } from 'ioredis';
import { IStorageService } from '@domain/context-management/IStorageService';

export class StorageService implements IStorageService {
  constructor(private readonly redisClient: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  // This method is not part of the IStorageService interface
  // but we'll keep it for additional functionality
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
