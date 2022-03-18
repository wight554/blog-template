import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '@server/user/UserController';
import { UserService } from '@server/user/UserService';
import { mockUpdatedUser } from '@test/server/user/mocks/mockUpdatedUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';
import { mockUser } from '@test/server/user/mocks/mockUser';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: vi.fn().mockResolvedValue(mockUser),
            update: vi.fn().mockResolvedValue(mockUpdatedUser),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('should create user', async () => {
      await userController.signup(mockUpsertUser);

      expect(userService.create).toBeCalledWith(mockUpsertUser);
    });

    describe('user service success', () => {
      it('should return created user', async () => {
        expect(await userController.signup(mockUpsertUser)).toBe(mockUser);
      });
    });

    describe('user service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(userService, 'create').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await userController.signup(mockUpsertUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('update', () => {
    const userId = '1';

    describe('user id param matches current user id', () => {
      it('should update user', async () => {
        await userController.update(userId, mockUpsertUser, mockUser);

        expect(userService.update).toBeCalledWith(userId, mockUpsertUser);
      });
    });

    describe('user id param does not match current user id', () => {
      it('should update user', async () => {
        const badUserId = '2';

        try {
          await userController.update(badUserId, mockUpsertUser, mockUser);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('user service success', () => {
      it('should return updated user', async () => {
        expect(await userController.update(userId, mockUpsertUser, mockUser)).toBe(mockUpdatedUser);
      });
    });

    describe('user service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(userService, 'update').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await userController.update(userId, mockUpsertUser, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
