import { FieldValidator } from 'final-form';

export const required: FieldValidator<string> = (value) => (value ? undefined : 'Required field');

export const alphanumeric: FieldValidator<string> = (value) =>
  /^[a-zA-Z0-9]*$/.test(value) ? undefined : 'Must contain only letters and numbers';

export const mustMatch =
  (field: string): FieldValidator<string> =>
  (value, allValues) => {
    return allValues[field as keyof object] === value ? undefined : `Must match ${field}`;
  };

export const composeValidators =
  <T = unknown>(...validators: Array<FieldValidator<T>>): FieldValidator<T> =>
  (value, allValues) =>
    validators.reduce((result, validator) => result || validator(value, allValues), undefined);
