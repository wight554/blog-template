import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';

import { User } from '@server/decorators/UserDecorator';
import { getParamDecoratorFactory } from '@test/server/testUtils';
import { mockUser } from '@test/server/user/mocks';

const mockSwitchToHttp = (): HttpArgumentsHost => ({
  getRequest: vi.fn().mockReturnValue({
    user: mockUser,
  }),
  getResponse: vi.fn(),
  getNext: vi.fn(),
});

const mockCtx = <ExecutionContext>{
  switchToHttp: mockSwitchToHttp,
};

describe('UserDecorator', () => {
  it('should return user', () => {
    const factory = getParamDecoratorFactory(User);
    const result = factory(null, mockCtx);

    expect(result).toBe(mockUser);
  });
});
