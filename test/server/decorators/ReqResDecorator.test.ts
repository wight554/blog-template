import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { mock, instance, when } from 'ts-mockito';

import { getParamDecoratorFactory } from '@test/utils/mocks/getParamDecoratorFactory';
import { ReqRes } from '@server/decorators/ReqResDecorator';

const response = 'response';

const mockCtx = mock<ExecutionContext>();
const mockHttpArgumentsHost: HttpArgumentsHost = mock<HttpArgumentsHost>();

when(mockCtx.switchToHttp).thenReturn(() => instance(mockHttpArgumentsHost));
when(mockHttpArgumentsHost.getRequest).thenReturn(
  vi.fn().mockReturnValue({
    res: response,
  }),
);

const ctx = instance(mockCtx);

describe('ReqResDecorator', function () {
  it('should return response', function () {
    const factory = getParamDecoratorFactory(ReqRes);
    const result = factory(null, ctx);

    expect(result).toBe(response);
  });
});
