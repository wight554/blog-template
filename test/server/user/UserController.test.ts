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
            getById: vi.fn().mockResolvedValue(mockUser),
            update: vi.fn().mockResolvedValue(mockUpdatedUser),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('get', () => {
    it('should get user', async () => {
      await userController.get(mockUser);

      expect(userService.getById).toBeCalledWith(mockUser.id);
    });

    describe('user service success', () => {
      it('should return user', async () => {
        expect(await userController.get(mockUser)).toBe(mockUser);
      });
    });

    describe('user service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(userService, 'getById').mockRejectedValueOnce(error);
        expect.assertions(1);

        await expect(userController.get(mockUser)).rejects.toThrowError(error);
      });
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      await userController.create(mockUpsertUser);

      expect(userService.create).toBeCalledWith(mockUpsertUser);
    });

    describe('user service success', () => {
      it('should return created user', async () => {
        expect(await userController.create(mockUpsertUser)).toBe(mockUser);
      });
    });

    describe('user service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(userService, 'create').mockRejectedValueOnce(error);
        expect.assertions(1);

        await expect(userController.create(mockUpsertUser)).rejects.toThrowError(error);
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

        await expect(
          userController.update(badUserId, mockUpsertUser, mockUser),
        ).rejects.toThrowError(ForbiddenException);
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

        await expect(userController.update(userId, mockUpsertUser, mockUser)).rejects.toThrowError(
          error,
        );
      });
    });
  });
});
