import { ValidationError } from '@src/enums/ValidationError';
import { alphanumeric, composeValidators, mustMatch, required } from '@src/utils/validators';

describe('validators', () => {
  describe('required', () => {
    describe('value is valid', () => {
      it('should return undefined', () => {
        expect(required('value', {})).toBe(undefined);
      });
    });

    describe('value is invalid', () => {
      it('should return error', () => {
        expect(required('', {})).toBe(ValidationError.REQUIRED);
      });
    });
  });

  describe('alphanumeric', () => {
    describe('value is valid', () => {
      it('should return undefined', () => {
        expect(alphanumeric('value123', {})).toBe(undefined);
      });
    });

    describe('value is invalid', () => {
      it('should return error', () => {
        expect(alphanumeric('$#!', {})).toBe(ValidationError.ALPHANUMERIC);
      });
    });
  });

  describe('mustMatch', () => {
    describe('value is valid', () => {
      it('should return undefined', () => {
        const field = 'field';

        expect(mustMatch(field)('value', { field: 'value' })).toBe(undefined);
      });
    });

    describe('value is invalid', () => {
      it('should return error', () => {
        const field = 'field';

        expect(mustMatch(field)('value', {})).toBe(`Must match ${field}`);
      });
    });
  });

  describe('composeValidators', () => {
    const validValidator = vi.fn().mockReturnValue(undefined);
    const invalidValidator = vi.fn().mockReturnValue('error');
    const value = 'value';

    it('should call given validators with given arguments', () => {
      composeValidators(validValidator, invalidValidator)(value, {});

      expect(validValidator).toHaveBeenCalledWith(value, {});
      expect(invalidValidator).toHaveBeenCalledWith(value, {});
    });

    describe('value is valid for all given validators', () => {
      it('should return undefined', () => {
        expect(composeValidators(validValidator, validValidator)(value, {})).toBe(undefined);
      });
    });

    describe('value is invalid for one of given validators', () => {
      it('should return error', () => {
        expect(composeValidators(validValidator, invalidValidator)(value, {})).toBe('error');
      });
    });
  });
});
