import { ClassSerializerInterceptor, Type } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';

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
      const response = Object.create(Document.prototype);

      test('should exclude properties with exclude decorator from response', () => {
        vi.spyOn(response, 'toJSON').mockReturnValueOnce({ include: 'test', exclude: 'test' });

        expect(instance.serialize(response, {})).toEqual({
          include: 'test',
        });
      });
    });

    describe('response is document with nested results document', () => {
      const response = Object.create(Document.prototype);
      response.results = Object.create(Document.prototype);

      test('should exclude properties with exclude decorator from results document', () => {
        vi.spyOn(response.results, 'toJSON').mockReturnValueOnce({
          include: 'test',
          exclude: 'test',
        });

        expect(instance.serialize(response, {})).toEqual({
          results: {
            include: 'test',
          },
        });
      });
    });

    describe('response is array of documents', () => {
      const response = Object.create(Document.prototype);

      test('should exclude properties with exclude decorator from response array', () => {
        vi.spyOn(response, 'toJSON').mockReturnValueOnce({ include: 'test', exclude: 'test' });

        expect(instance.serialize([response], {})).toEqual([
          {
            include: 'test',
          },
        ]);
      });
    });

    describe('response is not an instance of Document', () => {
      test('should return response', () => {
        const response = { test: 'test' };
        expect(instance.serialize(response, {})).toEqual(response);
      });
    });

    describe('response is empty', () => {
      test('should return response', () => {
        expect(instance.serialize(undefined as any, {})).toEqual(undefined);
      });
    });
  });
});
