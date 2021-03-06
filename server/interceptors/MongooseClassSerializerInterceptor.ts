import { ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import mongoose from 'mongoose';

export function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): Type<ClassSerializerInterceptor> {
  return class MongooseClassSerializerInterceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof mongoose.Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
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
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[] = {},
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
