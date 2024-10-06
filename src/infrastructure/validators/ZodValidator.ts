import { z } from 'zod';
import { IValidator, ValidationError } from '@domain/shared/IValidator';

export class ZodValidator<T> implements IValidator<T> {
  constructor(private schema: z.ZodType<T>) {}

  validate(data: unknown): T {
    try {
      return this.schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }
}
