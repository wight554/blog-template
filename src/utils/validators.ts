import { FieldValidator } from 'final-form';

import { ValidationError } from '@src/enums/ValidationError';

export const required: FieldValidator<string> = (value) =>
  value ? undefined : ValidationError.REQUIRED;

export const alphanumeric: FieldValidator<string> = (value) =>
  /^[a-zA-Z0-9]*$/.test(value) ? undefined : ValidationError.ALPHANUMERIC;

export const mustMatch =
  (field: string): FieldValidator<string> =>
  (value, allValues) => {
    return allValues[field as keyof object] === value ? undefined : `Must match ${field}`;
  };

export const composeValidators =
  <T = unknown>(...validators: Array<FieldValidator<T>>): FieldValidator<T> =>
  (value, allValues, meta) =>
    validators.reduce(
      (result, validator) => result || validator(value, allValues, meta),
      undefined,
    );
