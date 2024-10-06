export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface ITokenGenerator {
  generateToken(payload: any): string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export interface IAuthenticationService {
  register(username: string, password: string): Promise<any>;

  login(username: string, password: string): Promise<any>;

  validateUser(payload: any): Promise<any>;
}

export class AuthenticationService implements IAuthenticationService {
  private users: any[] = [];

  constructor(
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async register(username: string, password: string): Promise<any> {
    const existingUser = this.users.find((u) => u.username === username);
    if (existingUser) {
      throw new AuthenticationError('Username already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return this.generateToken(newUser);
  }

  async login(username: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    if (user && (await this.passwordHasher.compare(password, user.password))) {
      return this.generateToken(user);
    }
    throw new AuthenticationError('Invalid credentials');
  }

  async validateUser(payload: any): Promise<any> {
    const user = this.users.find((u) => u.id === payload.sub);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return user;
  }

  private generateToken(user: any): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.tokenGenerator.generateToken(payload),
    };
  }
}
