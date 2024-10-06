import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationController } from '@domain/authentication/Authentication.controller';
import { NestAuthenticationService } from './NestAuthenticationService';
import { ZodValidator } from '../../validators/ZodValidator';
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(50),
});
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

@Controller()
export class NestAuthenticationController {
  private domainController: AuthenticationController;

  constructor(authService: NestAuthenticationService) {
    const registerValidator = new ZodValidator(registerSchema);
    const loginValidator = new ZodValidator(loginSchema);
    this.domainController = new AuthenticationController(
      authService,
      // @ts-expect-error: Ignore the type mismatch error
      registerValidator,
      loginValidator,
    );
  }

  @Post('register')
  async register(@Body() registerDto: unknown) {
    return this.domainController.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: unknown) {
    return this.domainController.login(loginDto);
  }
}
