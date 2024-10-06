import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '@domain/authentication/Authentication.service';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
