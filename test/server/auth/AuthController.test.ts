import { ForbiddenException } from '@nestjs/common';
import sinon from 'sinon';

import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { UserDocument } from '@server/user/schemas/UserSchema';
import { createMockResponse } from '@test/utils/create-mock-response';

const cookieMock = 'cookie';

const userMock = <UserDocument>{
  id: '1',
  username: 'username',
};

const upsertUserMock = {
  username: 'username',
  password: 'password',
};

const mockResponse = createMockResponse();

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
      await authController.login(mockResponse, userMock);

      sinon.assert.calledWith(mockAuthService.getCookieWithJwtToken, userMock.id);
    });

    it('should set cookie header', async () => {
      mockAuthService.getCookieWithJwtToken.returns(cookieMock);

      await authController.login(mockResponse, userMock);

      expect(mockResponse.setHeader).toBeCalledWith('Set-Cookie', cookieMock);
    });

    it('should return user', async () => {
      expect(await authController.login(mockResponse, userMock)).toBe(userMock);
    });
  });

  describe('signup', () => {
    it('should create user', async () => {
      await authController.signup(upsertUserMock);

      sinon.assert.calledWith(mockAuthService.createUser, upsertUserMock);
    });

    describe('auth service success', () => {
      it('should return created user', async () => {
        mockAuthService.createUser.resolves(userMock);

        expect(await authController.signup(upsertUserMock)).toBe(userMock);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockAuthService.createUser.rejects(error);
        expect.assertions(1);

        await expect(authController.signup(upsertUserMock)).rejects.toEqual(error);
      });
    });
  });

  describe('update', () => {
    const userId = '1';

    describe('user id param matches current user id', () => {
      it('should update user', async () => {
        await authController.update(userId, upsertUserMock, userMock);

        sinon.assert.calledWith(mockAuthService.updateUser, userId, upsertUserMock);
      });
    });

    describe('user id param does not match current user id', () => {
      it('should update user', async () => {
        const badUserId = '2';

        try {
          await authController.update(badUserId, upsertUserMock, userMock);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('auth service success', () => {
      it('should return updated user', async () => {
        mockAuthService.updateUser.resolves(userMock);

        expect(await authController.update(userId, upsertUserMock, userMock)).toBe(userMock);
      });
    });

    describe('auth service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockAuthService.updateUser.rejects(error);
        expect.assertions(1);

        await expect(authController.update(userId, upsertUserMock, userMock)).rejects.toEqual(
          error,
        );
      });
    });
  });
});
