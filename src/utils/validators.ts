type ValidatorResult = string | undefined;
type Validator = (value: string) => ValidatorResult;

export const required: Validator = (value) => (value ? undefined : 'Required field');

export const alphanumeric: Validator = (value) =>
  /^[a-zA-Z0-9]*$/.test(value) ? undefined : 'Must contain only letters and numbers';

export const composeValidators =
  (...validators: Array<Validator>) =>
  (value: string) =>
    validators.reduce(
      (result: ValidatorResult, validator) => result || validator(value),
      undefined,
    );
