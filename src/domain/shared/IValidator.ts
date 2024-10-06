export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface IValidator<T> {
  validate(data: unknown): T;
}
