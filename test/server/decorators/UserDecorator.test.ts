import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces/index.js';

import { User } from '@server/decorators/UserDecorator.js';
import { getParamDecoratorFactory } from '@test/server/testUtils/index.js';
import { mockUser } from '@test/server/user/mocks/index.js';

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
