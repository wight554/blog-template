import { ForbiddenException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { mock, instance, when, reset } from 'ts-mockito';

import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { mockUpdatedUser } from '@test/server/user/mocks/mockUpdatedUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';
import { mockUser } from '@test/server/user/mocks/mockUser';

const cookie = 'cookie';
const userId = '1';

const mockAuthService = mock<AuthService>();

const mockReply = mock<FastifyReply>();
const reply = instance(mockReply);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    authService = instance(mockAuthService);

    when(mockAuthService.getCookieWithJwtToken).thenReturn(vi.fn().mockReturnValue(cookie));
    when(mockAuthService.createUser).thenReturn(vi.fn().mockResolvedValue(mockUser));
    when(mockAuthService.updateUser).thenReturn(vi.fn().mockResolvedValue(mockUpdatedUser));

    when(mockReply.header).thenReturn(vi.fn());

    authController = new AuthController(authService);
  });

  afterEach(() => {
    reset(mockAuthService);
    reset(mockReply);
  });

  describe('login', () => {
    it('should get token', async () => {
      await authController.login(reply, mockUser);

      expect(authService.getCookieWithJwtToken).toBeCalledWith(userId);
    });

    it('should set cookie header', async () => {
      await authController.login(reply, mockUser);

      expect(reply.header).toBeCalledWith('Set-Cookie', cookie);
    });

    it('should return user', async () => {
      expect(await authController.login(reply, mockUser)).toBe(mockUser);
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
        when(mockAuthService.createUser).thenThrow(error);
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
        when(mockAuthService.updateUser).thenThrow(error);
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
