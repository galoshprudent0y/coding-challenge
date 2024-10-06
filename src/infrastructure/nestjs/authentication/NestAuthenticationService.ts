import { Injectable } from '@nestjs/common';
import {
  AuthenticationService,
  IAuthenticationService,
} from '@domain/authentication/Authentication.service';
import { BcryptPasswordHasher } from './utils/BcryptPasswordHasher';
import { JwtTokenGenerator } from './utils/JwtTokenGenerator';

@Injectable()
export class NestAuthenticationService implements IAuthenticationService {
  private domainService: AuthenticationService;

  constructor(
    bcryptPasswordHasher: BcryptPasswordHasher,
    jwtTokenGenerator: JwtTokenGenerator,
  ) {
    this.domainService = new AuthenticationService(
      bcryptPasswordHasher,
      jwtTokenGenerator,
    );
  }

  async register(username: string, password: string): Promise<any> {
    return this.domainService.register(username, password);
  }

  async login(username: string, password: string): Promise<any> {
    return this.domainService.login(username, password);
  }

  async validateUser(payload: any): Promise<any> {
    return this.domainService.validateUser(payload);
  }
}
