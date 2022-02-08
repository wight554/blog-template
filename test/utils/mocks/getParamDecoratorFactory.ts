import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function getParamDecoratorFactory(decorator: () => ParameterDecorator) {
  class TestDecorator {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public test(@decorator() _value: any) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}
