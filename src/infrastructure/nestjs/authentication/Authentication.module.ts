import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NestAuthenticationController } from './NestAuthenticationController';
import { NestAuthenticationService } from './NestAuthenticationService';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BcryptPasswordHasher } from './utils/BcryptPasswordHasher';
import { JwtTokenGenerator } from './utils/JwtTokenGenerator';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [NestAuthenticationController],
  providers: [
    NestAuthenticationService,
    JwtStrategy,
    JwtAuthGuard,
    BcryptPasswordHasher,
    JwtTokenGenerator,
  ],
  exports: [NestAuthenticationService, JwtAuthGuard],
})
export class AuthenticationModule {}
