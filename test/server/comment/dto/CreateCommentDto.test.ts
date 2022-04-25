import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateCommentDto } from '@server/comment/dto/CreateCommentDto.js';

describe('CreateCommentDto', () => {
  describe('text', () => {
    it('should not throw error when text is valid', async () => {
      const comment = { text: 'text' };
      const commentDto = plainToInstance(CreateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when text is not defined', async () => {
      const comment = {};
      const commentDto = plainToInstance(CreateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'text should not be empty',
        isString: 'text must be a string',
      });
    });

    it('should throw error when text is not string', async () => {
      const comment = { text: 123 };
      const commentDto = plainToInstance(CreateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'text must be a string' });
    });

    it('should throw error when text is empty string', async () => {
      const comment = { text: '' };
      const commentDto = plainToInstance(CreateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isNotEmpty: 'text should not be empty' });
    });
  });
});
