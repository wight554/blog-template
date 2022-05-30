import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreatePostDto } from '#server/post/dto/CreatePostDto.js';

describe('CreatePostDto', () => {
  describe('title', () => {
    it('should not throw error when title is valid', async () => {
      const post = { title: 'title' };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when title is not defined', async () => {
      const post = {};
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'title should not be empty',
        isString: 'title must be a string',
      });
    });

    it('should throw error when title is not string', async () => {
      const post = { title: 123 };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'title must be a string' });
    });

    it('should throw error when title is empty string', async () => {
      const post = { title: '' };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isNotEmpty: 'title should not be empty' });
    });
  });

  describe('description', () => {
    it('should not throw error when description is valid', async () => {
      const post = { title: 'title', description: 'description' };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when description is not defined', async () => {
      const post = { title: 'title' };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when description is not string', async () => {
      const post = { title: 'title', description: 123 };
      const postDto = plainToInstance(CreatePostDto, post);

      const errors = await validate(postDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'description must be a string' });
    });
  });
});
