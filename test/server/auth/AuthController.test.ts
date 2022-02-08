import { ForbiddenException } from '@nestjs/common';
import sinon from 'sinon';
import { Response } from 'express';
import { Mock } from 'moq.ts';

import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { mockUpdatedUser } from '@test/server/user/mocks/mockUpdatedUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';
import { mockUser } from '@test/server/user/mocks/mockUser';

const cookie = 'cookie';
const userId = '1';

const mockResponse = new Mock<Response>()
  .setup((instance) => instance.setHeader)
  .returns(vi.fn())
  .object();

const mockAuthService = sinon.createStubInstance(AuthService);

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController(mockAuthService);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe('login', () => {
    it('should get token', async () => {
      await authController.login(mockResponse, mockUser);

      sinon.assert.calledWith(mockAuthService.getCookieWithJwtToken, userId);
    });

    it('should set cookie header', async () => {
      mockAuthService.getCookieWithJwtToken.returns(cookie);

      await authController.login(mockResponse, mockUser);

      expect(mockResponse.setHeader).toBeCalledWith('Set-Cookie', cookie);
    });

    it('should return user', async () => {
      expect(await authController.login(mockResponse, mockUser)).toBe(mockUser);
    });
  });

  describe('signup', () => {
    it('should create user', async () => {
      await authController.signup(mockUpsertUser);

      sinon.assert.calledWith(mockAuthService.createUser, mockUpsertUser);
    });

    describe('auth service success', () => {
      it('should return created user', async () => {
        mockAuthService.createUser.resolves(mockUser);

        expect(await authController.signup(mockUpsertUser)).toBe(mockUser);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockAuthService.createUser.rejects(error);
        expect.assertions(1);

        await expect(authController.signup(mockUpsertUser)).rejects.toEqual(error);
      });
    });
  });

  describe('update', () => {
    const userId = '1';

    describe('user id param matches current user id', () => {
      it('should update user', async () => {
        await authController.update(userId, mockUpsertUser, mockUser);

        sinon.assert.calledWith(mockAuthService.updateUser, userId, mockUpsertUser);
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
        mockAuthService.updateUser.resolves(mockUpdatedUser);

        expect(await authController.update(userId, mockUpsertUser, mockUser)).toBe(mockUpdatedUser);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockAuthService.updateUser.rejects(error);
        expect.assertions(1);

        await expect(authController.update(userId, mockUpsertUser, mockUser)).rejects.toEqual(
          error,
        );
      });
    });
  });
});
