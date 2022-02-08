import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Mock } from 'moq.ts';

import { User } from '@server/decorators/UserDecorator';
import { getParamDecoratorFactory } from '@test/utils/mocks/getParamDecoratorFactory';
import { mockUser } from '@test/server/user/mocks/mockUser';

const mockCtx = new Mock<ExecutionContext>()
  .setup((instance) => instance.switchToHttp)
  .returns(() =>
    new Mock<HttpArgumentsHost>()
      .setup((instance) => instance.getRequest)
      .returns(
        vi.fn().mockReturnValue({
          user: mockUser,
        }),
      )
      .object(),
  )
  .object();

describe('UserDecorator', function () {
  it('should return user', function () {
    const factory = getParamDecoratorFactory(User);
    const result = factory(null, mockCtx);

    expect(result).toBe(mockUser);
  });
});
