import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  describe('username', () => {
    it('should not throw error when username is valid', async () => {
      const user = { username: 'user1', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when username is not defined', async () => {
      const user = { password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isAlphanumeric: 'username must contain only letters and numbers',
        isNotEmpty: 'username should not be empty',
        isString: 'username must be a string',
      });
    });

    it('should throw error when username is not string', async () => {
      const user = { username: 123, password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isAlphanumeric: 'username must contain only letters and numbers',
        isString: 'username must be a string',
      });
    });

    it('should throw error when username is not alphanumeric string', async () => {
      const user = { username: '1#2_3.', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isAlphanumeric: 'username must contain only letters and numbers',
      });
    });

    it('should throw error when username is empty string', async () => {
      const user = { username: '', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isAlphanumeric: 'username must contain only letters and numbers',
        isNotEmpty: 'username should not be empty',
      });
    });
  });

  describe('password', () => {
    it('should not throw error when password is valid', async () => {
      const user = { username: 'user1', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when password is not defined', async () => {
      const user = { username: 'user1' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'password should not be empty',
        isString: 'password must be a string',
      });
    });

    it('should throw error when password is not string', async () => {
      const user = { username: 'user1', password: 123 };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isString: 'password must be a string',
      });
    });

    it('should throw error when password is empty string', async () => {
      const user = { username: 'user1', password: '' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'password should not be empty',
      });
    });
  });

  describe('lastName', () => {
    it('should not throw error when lastName is valid', async () => {
      const user = { username: 'user1', password: '123', lastName: 'lastName' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when lastName is not defined', async () => {
      const user = { username: 'user1', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when lastName is not string', async () => {
      const user = { username: 'user1', password: '123', lastName: 123 };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isString: 'lastName must be a string',
      });
    });
  });

  describe('firstName', () => {
    it('should not throw error when firstName is valid', async () => {
      const user = { username: 'user1', password: '123', firstName: 'firstName' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when firstName is not defined', async () => {
      const user = { username: 'user1', password: '123' };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when firstName is not string', async () => {
      const user = { username: 'user1', password: '123', firstName: 123 };
      const userDto = plainToInstance(CreateUserDto, user);

      const errors = await validate(userDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isString: 'firstName must be a string',
      });
    });
  });
});
