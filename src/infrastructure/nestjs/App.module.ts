import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntentDetectionModule } from './intent-detection/IntentDetection.module';
import { FlowManagementModule } from './flow-management/FlowManagement.module';
import { MessageHandlingModule } from './message-handling/MessageHandling.module';
import { ContextManagementModule } from './context-management/ContextManagement.module';
import { AuthenticationModule } from './authentication/Authentication.module';
import { HealthController } from './health/Health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IntentDetectionModule,
    FlowManagementModule,
    MessageHandlingModule,
    ContextManagementModule,
    AuthenticationModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
