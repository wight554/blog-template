import { Test } from '@nestjs/testing';
import { PostController } from '@server/post/PostController';

describe('PostController', () => {
  let postController: PostController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
    }).compile();

    postController = moduleRef.get<PostController>(PostController);
  });

  describe('login', () => {
    it('should return OK', async () => {
      const result = 'OK';

      expect(await postController.getPosts()).toBe(result);
    });
  });
});
