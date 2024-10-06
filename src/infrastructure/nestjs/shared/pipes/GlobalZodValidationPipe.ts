import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class GlobalZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (!metadata.metatype) {
      return value;
    }

    const schema = (metadata.metatype as any).schema;
    if (!(schema instanceof ZodSchema)) {
      return value;
    }

    try {
      return schema.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed', {
        cause: error,
        description: error.errors,
      });
    }
  }
}
