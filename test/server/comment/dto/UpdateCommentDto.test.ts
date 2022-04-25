import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateCommentDto } from '@server/comment/dto/UpdateCommentDto.js';

describe('UpdateCommentDto', () => {
  describe('text', () => {
    it('should not throw error when text is valid', async () => {
      const comment = { text: 'text' };
      const commentDto = plainToInstance(UpdateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).toBe(0);
    });

    it('should not throw error when text is not defined', async () => {
      const comment = {};
      const commentDto = plainToInstance(UpdateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).toBe(0);
    });

    it('should throw error when text is not string', async () => {
      const comment = { text: 123 };
      const commentDto = plainToInstance(UpdateCommentDto, comment);

      const errors = await validate(commentDto);

      expect(errors.length).not.toBe(0);
      expect(errors[0].constraints).toEqual({ isString: 'text must be a string' });
    });
  });
});
