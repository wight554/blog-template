import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { mock, instance, when } from 'ts-mockito';

import { User } from '@server/decorators/UserDecorator';
import { getParamDecoratorFactory } from '@test/utils/mocks/getParamDecoratorFactory';
import { mockUser } from '@test/server/user/mocks/mockUser';

const mockCtx = mock<ExecutionContext>();
const mockHttpArgumentsHost: HttpArgumentsHost = mock<HttpArgumentsHost>();

when(mockCtx.switchToHttp).thenReturn(() => instance(mockHttpArgumentsHost));
when(mockHttpArgumentsHost.getRequest).thenReturn(
  vi.fn().mockReturnValue({
    user: mockUser,
  }),
);

const ctx = instance(mockCtx);

describe('UserDecorator', function () {
  it('should return user', function () {
    const factory = getParamDecoratorFactory(User);
    const result = factory(null, ctx);

    expect(result).toBe(mockUser);
  });
});
