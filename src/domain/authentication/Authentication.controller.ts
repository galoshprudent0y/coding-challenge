import { IAuthenticationService } from './Authentication.service';
import { IValidator } from '../shared/IValidator';

export interface IAuthenticationController {
  register(registerDto: unknown): Promise<any>;
  login(loginDto: unknown): Promise<any>;
}

export type RegisterDto = {
  username: string;
  password: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export class AuthenticationController implements IAuthenticationController {
  constructor(
    private readonly authService: IAuthenticationService,
    private readonly registerValidator: IValidator<RegisterDto>,
    private readonly loginValidator: IValidator<LoginDto>,
  ) {}

  async register(registerDto: unknown): Promise<any> {
    const validatedData = this.registerValidator.validate(registerDto);
    return await this.authService.register(
      validatedData.username,
      validatedData.password,
    );
  }

  async login(loginDto: unknown): Promise<any> {
    const validatedData = this.loginValidator.validate(loginDto);
    return await this.authService.login(
      validatedData.username,
      validatedData.password,
    );
  }
}
