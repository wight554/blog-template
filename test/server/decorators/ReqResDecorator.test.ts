import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Mock } from 'moq.ts';

import { getParamDecoratorFactory } from '@test/utils/mocks/getParamDecoratorFactory';
import { ReqRes } from '@server/decorators/ReqResDecorator';

const response = 'response';

const mockCtx = new Mock<ExecutionContext>()
  .setup((instance) => instance.switchToHttp)
  .returns(() =>
    new Mock<HttpArgumentsHost>()
      .setup((instance) => instance.getRequest)
      .returns(
        vi.fn().mockReturnValue({
          res: response,
        }),
      )
      .object(),
  )
  .object();

describe('ReqResDecorator', function () {
  it('should return response', function () {
    const factory = getParamDecoratorFactory(ReqRes);
    const result = factory(null, mockCtx);

    expect(result).toBe(response);
  });
});
