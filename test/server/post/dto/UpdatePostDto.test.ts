import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdatePostDto } from '#server/post/dto/UpdatePostDto.js';

describe('UpdatePostDto', () => {
  describe('title', () => {
    it('should not throw error when title is valid', async () => {
      const post = { title: 'title' };
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when title is not defined', async () => {
      const post = {};
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when title is not string', async () => {
      const post = { title: 123 };
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'title must be a string' });
    });
  });

  describe('description', () => {
    it('should not throw error when description is valid', async () => {
      const post = { title: 'title', description: 'description' };
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when description is not defined', async () => {
      const post = { title: 'title' };
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when description is not string', async () => {
      const post = { title: 'title', description: 123 };
      const postDto = plainToInstance(UpdatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'description must be a string' });
    });
  });
});
