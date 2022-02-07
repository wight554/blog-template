import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';

import { getParamDecoratorFactory } from '@test/utils/get-param-decorator-factory';
import { ReqRes } from '@server/decorators/ReqResDecorator';

const responseMock = 'response';

const switchToHttpMock = (): HttpArgumentsHost => ({
  getRequest: vi.fn().mockReturnValue({
    res: responseMock,
  }),
  getResponse: vi.fn(),
  getNext: vi.fn(),
});

const ctxMock = <ExecutionContext>{
  switchToHttp: switchToHttpMock,
};

describe('ReqResDecorator', function () {
  it('should return response', function () {
    const factory = getParamDecoratorFactory(ReqRes);
    const result = factory(null, ctxMock);

    expect(result).toBe(responseMock);
  });
});
