import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { NestContextManagementService } from './NestContextManagementService';
import {
  ContextManagementController,
  UpdateContextDto,
} from '@domain/context-management/ContextManagement.controller';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { ZodValidator } from '../../validators/ZodValidator';

// @ts-ignore: Ignore the type mismatch error
const updateContextSchema: z.ZodType<UpdateContextDto> = z
  .object({
    userId: z.string(),
    context: z.record(z.unknown()),
  })
  .required();

@Controller()
@UseGuards(JwtAuthGuard)
export class NestContextManagementController {
  private domainController: ContextManagementController;

  constructor(nestContextManagementService: NestContextManagementService) {
    const updateContextValidator = new ZodValidator<UpdateContextDto>(
      updateContextSchema,
    );
    this.domainController = new ContextManagementController(
      nestContextManagementService,
      updateContextValidator,
    );
  }

  @Get('retrieveContext/:userId')
  async retrieveContext(@Param('userId') userId: string) {
    return this.domainController.retrieveContext(userId);
  }

  @Post('updateContext')
  async updateContext(@Body() updateContextDto: unknown) {
    return this.domainController.updateContext(updateContextDto);
  }
}
