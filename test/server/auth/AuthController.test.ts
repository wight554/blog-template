import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { mockUpdatedUser } from '@test/server/user/mocks/mockUpdatedUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';
import { mockUser } from '@test/server/user/mocks/mockUser';
import { createMockReply } from '@test/utils/mocks/createMockReply';

const cookie = 'cookie';
const userId = '1';

const mockReply = createMockReply();

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getCookieWithJwtToken: vi.fn().mockReturnValue(cookie),
            createUser: vi.fn().mockResolvedValue(mockUser),
            updateUser: vi.fn().mockResolvedValue(mockUpdatedUser),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should get token', async () => {
      await authController.login(mockReply, mockUser);

      expect(authService.getCookieWithJwtToken).toBeCalledWith(userId);
    });

    it('should set cookie header', async () => {
      await authController.login(mockReply, mockUser);

      expect(mockReply.header).toBeCalledWith('Set-Cookie', cookie);
    });

    it('should return user', async () => {
      expect(await authController.login(mockReply, mockUser)).toBe(mockUser);
    });
  });

  describe('signup', () => {
    it('should create user', async () => {
      await authController.signup(mockUpsertUser);

      expect(authService.createUser).toBeCalledWith(mockUpsertUser);
    });

    describe('auth service success', () => {
      it('should return created user', async () => {
        expect(await authController.signup(mockUpsertUser)).toBe(mockUser);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(authService, 'createUser').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await authController.signup(mockUpsertUser);
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
        await authController.update(userId, mockUpsertUser, mockUser);

        expect(authService.updateUser).toBeCalledWith(userId, mockUpsertUser);
      });
    });

    describe('user id param does not match current user id', () => {
      it('should update user', async () => {
        const badUserId = '2';

        try {
          await authController.update(badUserId, mockUpsertUser, mockUser);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('auth service success', () => {
      it('should return updated user', async () => {
        expect(await authController.update(userId, mockUpsertUser, mockUser)).toBe(mockUpdatedUser);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(authService, 'updateUser').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await authController.update(userId, mockUpsertUser, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
