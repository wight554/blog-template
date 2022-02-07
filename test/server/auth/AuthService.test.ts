import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import sinon from 'sinon';

import { AuthService } from '@server/auth/AuthService';
import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { UserDocument } from '@server/user/schemas/UserSchema';

const mockJwtService = sinon.createStubInstance(JwtService);
const mockConfigService = sinon.createStubInstance(ConfigService);
const mockUserService = sinon.createStubInstance(UserService);
const mockCryptoService = sinon.createStubInstance(CryptoService);

const userId = '1';
const username = 'username';
const password = 'password';

const userMock = <UserDocument>{
  id: userId,
  username,
  password,
};

const updatedUserMock = <UserDocument>{
  ...userMock,
  username: 'username 2',
};

const upsertUserMock = {
  username,
  password,
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      mockJwtService,
      mockConfigService,
      mockUserService,
      mockCryptoService,
    );
  });

  afterEach(() => {
    sinon.reset();
  });

  describe('validateUser', () => {
    it('should get user from user service', async () => {
      await authService.validateUser(username, password);

      sinon.assert.calledWith(mockUserService.getByUsername, username);
    });

    describe('password is valid', async () => {
      it('should return user', async () => {
        mockUserService.getByUsername.resolves(userMock);
        mockCryptoService.compare.resolves(true);

        expect(await authService.validateUser(username, password)).toBe(userMock);
      });
    });

    describe('password is invalid', async () => {
      it('should return user', async () => {
        mockUserService.getByUsername.resolves(userMock);
        mockCryptoService.compare.resolves(false);

        expect(await authService.validateUser(username, password)).toBe(null);
      });
    });

    describe('getCookieWithJwtToken', () => {
      it('should get token from jwt service', async () => {
        authService.getCookieWithJwtToken(userId);

        sinon.assert.calledWith(mockJwtService.sign, { userId });
      });

      it('should return cookie with token', async () => {
        const token = 'token';
        const jwtExpirationTime = 1;

        mockJwtService.sign.returns(token);
        mockConfigService.get.returns(jwtExpirationTime);

        expect(authService.getCookieWithJwtToken(userId)).toBe(
          `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExpirationTime}`,
        );
      });
    });

    describe('createUser', () => {
      describe('crypto service success', () => {
        it('should get hashed password from crypto service', async () => {
          await authService.createUser(upsertUserMock);

          sinon.assert.calledWith(mockCryptoService.hash, password, 10);
        });

        it('should create user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);

          await authService.createUser(upsertUserMock);

          sinon.assert.calledWith(mockUserService.create, {
            ...upsertUserMock,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          mockCryptoService.hash.rejects(error);

          expect.assertions(1);

          await expect(authService.createUser(upsertUserMock)).rejects.toEqual(error);
        });
      });

      describe('user service success', () => {
        it('should return created user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.create.resolves(userMock);

          expect(await authService.createUser(upsertUserMock)).toBe(userMock);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const hashedPassword = 'hashedPassword';
          const error = new Error('Internal Error');
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.create.rejects(error);

          expect.assertions(1);

          await expect(authService.createUser(upsertUserMock)).rejects.toEqual(error);
        });
      });
    });

    describe('updateUser', () => {
      describe('crypto service success', () => {
        it('should get hashed password from crypto service', async () => {
          await authService.updateUser(userId, upsertUserMock);

          sinon.assert.calledWith(mockCryptoService.hash, password, 10);
        });

        it('should update user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);

          await authService.updateUser(userId, upsertUserMock);

          sinon.assert.calledWith(mockUserService.update, userId, {
            ...upsertUserMock,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          mockCryptoService.hash.rejects(error);

          expect.assertions(1);

          await expect(authService.updateUser(userId, upsertUserMock)).rejects.toEqual(error);
        });
      });

      describe('user service success', () => {
        it('should return updated user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.update.resolves(updatedUserMock);

          expect(await authService.updateUser(userId, upsertUserMock)).toBe(updatedUserMock);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const hashedPassword = 'hashedPassword';
          const error = new Error('Internal Error');
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.update.rejects(error);

          expect.assertions(1);

          await expect(authService.updateUser(userId, upsertUserMock)).rejects.toEqual(error);
        });
      });
    });
  });
});
