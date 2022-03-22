import { ClassSerializerInterceptor, Type } from '@nestjs/common';
import { Exclude } from 'class-transformer';

import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { createMockDocument } from '@test/server/mockUtils';

class MockClass {
  include: string;

  @Exclude()
  exclude: string;
}

describe('MongooseClassSerializerInterceptor', () => {
  let Interceptor: Type<ClassSerializerInterceptor>;
  let instance: ClassSerializerInterceptor;

  beforeAll(() => {
    Interceptor = MongooseClassSerializerInterceptor(MockClass);
    instance = new Interceptor();
  });

  test('should return class that extends ClassSerializerInterceptor', () => {
    expect(Object.getPrototypeOf(Interceptor)).toBe(ClassSerializerInterceptor);
  });

  describe('serialize', () => {
    describe('response is single instance of document', () => {
      const response = createMockDocument({ include: 'test', exclude: 'test' });

      test('should exclude properties with exclude decorator from response', () => {
        expect(instance.serialize(response, {})).toEqual({
          include: 'test',
        });
      });
    });

    describe('response is object with results document', () => {
      const response = { results: createMockDocument({ include: 'test', exclude: 'test' }) };

      test('should exclude properties with exclude decorator from results document', () => {
        expect(instance.serialize(response, {})).toEqual({
          results: {
            include: 'test',
          },
        });
      });
    });

    describe('response is array of documents', () => {
      const response = createMockDocument({ include: 'test', exclude: 'test' });

      test('should exclude properties with exclude decorator from response array', () => {
        expect(instance.serialize([response], {})).toEqual([
          {
            include: 'test',
          },
        ]);
      });
    });

    describe('response is not an instance of Document', () => {
      const response = { test: 'test' };

      test('should return response', () => {
        expect(instance.serialize(response, {})).toEqual(response);
      });
    });
  });
});
