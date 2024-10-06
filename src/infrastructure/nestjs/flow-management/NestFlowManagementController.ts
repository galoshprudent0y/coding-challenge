import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FlowManagementController } from '@domain/flow-management/FlowManagement.controller';
import { NestFlowManagementService } from './NestFlowManagementService';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { ZodValidator } from '../../validators/ZodValidator';
import { z } from 'zod';

const UserIdSchema = z.object({
  userId: z.string().nonempty('User ID is required'),
});

@Controller()
@UseGuards(JwtAuthGuard)
export class NestFlowManagementController {
  private domainController: FlowManagementController;

  constructor(
    private readonly flowManagementService: NestFlowManagementService,
  ) {
    const userIdValidator = new ZodValidator(UserIdSchema);
    this.domainController = new FlowManagementController(
      flowManagementService,
      //@ts-expect-error need to figure out why there's a mismatch between these types
      userIdValidator,
    );
  }

  @Post('initiateCheckIn')
  async initiateCheckIn(@Body() userIdDto: unknown) {
    return this.domainController.initiateCheckIn(userIdDto);
  }

  @Get('currentFlow/:userId')
  async getCurrentFlow(@Param() params: unknown) {
    return this.domainController.getCurrentFlow(params);
  }
}
