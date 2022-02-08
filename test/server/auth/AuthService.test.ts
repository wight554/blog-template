import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import sinon from 'sinon';

import { AuthService } from '@server/auth/AuthService';
import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockUpdatedMongoUser } from '@test/server/user/mocks/mockUpdatedMongoUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';

const mockJwtService = sinon.createStubInstance(JwtService);
const mockConfigService = sinon.createStubInstance(ConfigService);
const mockUserService = sinon.createStubInstance(UserService);
const mockCryptoService = sinon.createStubInstance(CryptoService);

const userId = '1';
const username = 'username';
const password = 'password';

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
        mockUserService.getByUsername.resolves(mockMongoUser);
        mockCryptoService.compare.resolves(true);

        expect(await authService.validateUser(username, password)).toBe(mockMongoUser);
      });
    });

    describe('password is invalid', async () => {
      it('should return null', async () => {
        mockUserService.getByUsername.resolves(mockMongoUser);
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
          await authService.createUser(mockUpsertUser);

          sinon.assert.calledWith(mockCryptoService.hash, password, 10);
        });

        it('should create user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);

          await authService.createUser(mockUpsertUser);

          sinon.assert.calledWith(mockUserService.create, {
            ...mockUpsertUser,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          mockCryptoService.hash.rejects(error);

          expect.assertions(1);

          await expect(authService.createUser(mockUpsertUser)).rejects.toEqual(error);
        });
      });

      describe('user service success', () => {
        it('should return created user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.create.resolves(mockMongoUser);

          expect(await authService.createUser(mockUpsertUser)).toBe(mockMongoUser);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const hashedPassword = 'hashedPassword';
          const error = new Error('Internal Error');
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.create.rejects(error);

          expect.assertions(1);

          await expect(authService.createUser(mockUpsertUser)).rejects.toEqual(error);
        });
      });
    });

    describe('updateUser', () => {
      describe('crypto service success', () => {
        it('should get hashed password from crypto service', async () => {
          await authService.updateUser(userId, mockUpsertUser);

          sinon.assert.calledWith(mockCryptoService.hash, password, 10);
        });

        it('should update user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);

          await authService.updateUser(userId, mockUpsertUser);

          sinon.assert.calledWith(mockUserService.update, userId, {
            ...mockUpsertUser,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          mockCryptoService.hash.rejects(error);

          expect.assertions(1);

          await expect(authService.updateUser(userId, mockUpsertUser)).rejects.toEqual(error);
        });
      });

      describe('user service success', () => {
        it('should return updated user', async () => {
          const hashedPassword = 'hashedPassword';
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.update.resolves(mockUpdatedMongoUser);

          expect(await authService.updateUser(userId, mockUpsertUser)).toBe(mockUpdatedMongoUser);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const hashedPassword = 'hashedPassword';
          const error = new Error('Internal Error');
          mockCryptoService.hash.resolves(hashedPassword);
          mockUserService.update.rejects(error);

          expect.assertions(1);

          await expect(authService.updateUser(userId, mockUpsertUser)).rejects.toEqual(error);
        });
      });
    });
  });
});
