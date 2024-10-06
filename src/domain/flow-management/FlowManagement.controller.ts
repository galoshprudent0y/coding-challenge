import { IValidator } from '../shared/IValidator';

import { IFlowManagementService } from '@domain/flow-management/FlowManagement.service';

export type UserIdDto = {
  userId: string;
};

export class FlowManagementController {
  constructor(
    private readonly flowManagementService: IFlowManagementService,
    private readonly userIdValidator: IValidator<UserIdDto>,
  ) {}

  async initiateCheckIn(userIdDto: unknown): Promise<{ response: string }> {
    const { userId } = this.userIdValidator.validate(userIdDto);
    const response =
      await this.flowManagementService.initiateCheckInFlow(userId);
    return { response };
  }

  async getCurrentFlow(userIdDto: unknown): Promise<{ flow: string }> {
    const { userId } = this.userIdValidator.validate(userIdDto);
    const flow = await this.flowManagementService.getFlow(userId);
    return { flow };
  }
}
