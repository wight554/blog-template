import { ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

export interface MongooseClassSerializerInterceptor {
  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject> | undefined,
    options: ClassTransformOptions,
  ): PlainLiteralObject | Array<PlainLiteralObject>;
}

export function MongooseClassSerializerInterceptorFactory(
  classToIntercept: Type,
): Type<MongooseClassSerializerInterceptor> {
  return class extends ClassSerializerInterceptor implements MongooseClassSerializerInterceptor {
    private changePlainObjectToInstance(document: PlainLiteralObject) {
      if (!(document instanceof mongoose.Document)) {
        return document;
      }

      return plainToInstance(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ): PlainLiteralObject {
      if (!Array.isArray(response) && response.results) {
        const results = this.prepareResponse(response.results);
        return {
          ...response,
          results,
        };
      }

      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToInstance);
      }

      return this.changePlainObjectToInstance(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[] = {},
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
