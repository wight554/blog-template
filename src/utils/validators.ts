export const required = (value: string) => (value ? undefined : 'Required field');

export const alphanumeric = (value: string) =>
  /^[a-zA-Z0-9]*$/.test(value) ? undefined : 'Must contain only letters and numbers';

export const composeValidators =
  (...validators: Array<(value: string) => string | undefined>) =>
  (value: string) =>
    validators.reduce(
      (error: string | undefined, validator) => error || validator(value),
      undefined,
    );
