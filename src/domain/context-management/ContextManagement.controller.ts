import { IValidator, ValidationError } from '../shared/IValidator';
import { IContextManagementService } from '@domain/context-management/ContextManagement.service';

export interface IContextManagementController {
  retrieveContext(userId: string): Promise<{ context: any }>;
  updateContext(updateContextDto: unknown): Promise<{ message: string }>;
}
export type UpdateContextDto = {
  userId: string;
  context: Record<string, unknown>;
};

export class ContextManagementError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'ContextManagementError';
  }
}

export class ContextManagementController {
  constructor(
    private readonly contextManagementService: IContextManagementService,
    private readonly updateContextValidator: IValidator<UpdateContextDto>,
  ) {}

  async retrieveContext(userId: string) {
    const context = await this.contextManagementService.getContext(userId);
    return { context };
  }

  async updateContext(updateContextDto: unknown) {
    try {
      const validatedData =
        this.updateContextValidator.validate(updateContextDto);
      const { userId, context } = validatedData;
      await this.contextManagementService.updateContext(userId, context);
      return { message: 'Context updated successfully' };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ContextManagementError(
          `Invalid update context data: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
