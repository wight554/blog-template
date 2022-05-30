export const ROUTE_ARGS_METADATA = '__routeArguments__';

export function getParamDecoratorFactory(decorator: () => ParameterDecorator) {
  class TestDecorator {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public test(@decorator() _value: unknown) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}
