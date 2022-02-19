import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';

import { User } from '@server/decorators/UserDecorator';
import { getParamDecoratorFactory } from '@test/utils/mocks/getParamDecoratorFactory';
import { mockUser } from '@test/server/user/mocks/mockUser';

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

describe('UserDecorator', function () {
  it('should return user', function () {
    const factory = getParamDecoratorFactory(User);
    const result = factory(null, mockCtx);

    expect(result).toBe(mockUser);
  });
});
