import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { UserDocument } from '@server/user/schemas/UserSchema';
import { response, request } from 'express';
import sinon from 'sinon';

const cookieMock = 'cookie';

const userMock = <UserDocument>{
  id: '1',
  username: 'username',
};

const upsertUserMock = {
  username: 'username',
  password: 'password',
};

const mockResponse = sinon.stub(response);
const mockRequest = sinon.stub(request);
mockRequest.res = mockResponse;

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
      await authController.login(mockRequest, userMock);

      sinon.assert.calledWith(mockAuthService.getCookieWithJwtToken, userMock.id);
    });

    it('should set cookie header', async () => {
      mockAuthService.getCookieWithJwtToken.returns(cookieMock);

      await authController.login(mockRequest, userMock);

      sinon.assert.calledWith(mockResponse.setHeader, 'Set-Cookie', cookieMock);
    });

    it('should return user', async () => {
      expect(await authController.login(mockRequest, userMock)).toBe(userMock);
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

    it('should update user', async () => {
      await authController.update(userId, upsertUserMock, userMock);

      sinon.assert.calledWith(mockAuthService.updateUser, userId, upsertUserMock);
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
