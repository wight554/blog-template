import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';

import { User } from '@server/decorators/UserDecorator';
import { UserDocument } from '@server/user/schemas/UserSchema';
import { getParamDecoratorFactory } from '@test/utils/get-param-decorator-factory';

const userMock = <UserDocument>{
  id: '1',
  username: 'username',
  password: 'password',
};

const switchToHttpMock = (): HttpArgumentsHost => ({
  getRequest: vi.fn().mockReturnValue({
    user: userMock,
  }),
  getResponse: vi.fn(),
  getNext: vi.fn(),
});

const ctxMock = <ExecutionContext>{
  switchToHttp: switchToHttpMock,
};

describe('UserDecorator', function () {
  it('should return user', function () {
    const factory = getParamDecoratorFactory(User);
    const result = factory(null, ctxMock);

    expect(result).toBe(userMock);
  });
});
