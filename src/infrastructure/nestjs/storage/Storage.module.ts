import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { StorageService } from '../../storage/StorageService';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: STORAGE_SERVICE,
      useFactory: (redisClient: Redis) => {
        return new StorageService(redisClient);
      },
      inject: [REDIS_CLIENT],
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
