import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock, instance, when, reset } from 'ts-mockito';

import { AuthService } from '@server/auth/AuthService';
import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockUpdatedMongoUser } from '@test/server/user/mocks/mockUpdatedMongoUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';

const mockJwtService = mock<JwtService>();
const mockConfigService = mock<ConfigService>();
const mockUserService = mock<UserService>();
const mockCryptoService = mock<CryptoService>();

const userId = '1';
const username = 'username';
const password = 'password';
const token = 'token';
const jwtExpirationTime = 1;
const hashedPassword = 'hashedPassword';

describe('AuthService', () => {
  let jwtService: JwtService;
  let configService: ConfigService;
  let userService: UserService;
  let cryptoService: CryptoService;
  let authService: AuthService;

  beforeEach(() => {
    when(mockJwtService.sign).thenReturn(vi.fn().mockReturnValue(token));
    when(mockCryptoService.compare).thenReturn(vi.fn().mockResolvedValue(true));
    when(mockCryptoService.hash).thenReturn(vi.fn().mockResolvedValue(hashedPassword));
    when(mockConfigService.get).thenReturn(vi.fn().mockReturnValue(jwtExpirationTime));
    when(mockUserService.getByUsername).thenReturn(vi.fn().mockResolvedValue(mockMongoUser));
    when(mockUserService.create).thenReturn(vi.fn().mockResolvedValue(mockMongoUser));
    when(mockUserService.update).thenReturn(vi.fn().mockResolvedValue(mockUpdatedMongoUser));

    jwtService = instance(mockJwtService);
    configService = instance(mockConfigService);
    userService = instance(mockUserService);
    cryptoService = instance(mockCryptoService);

    authService = new AuthService(jwtService, configService, userService, cryptoService);
  });

  afterEach(() => {
    reset(mockJwtService);
    reset(mockConfigService);
    reset(mockUserService);
    reset(mockCryptoService);
  });

  describe('validateUser', () => {
    it('should get user from user service', async () => {
      await authService.validateUser(username, password);

      expect(userService.getByUsername).toBeCalledWith(username);
    });

    describe('password is valid', async () => {
      it('should return user', async () => {
        expect(await authService.validateUser(username, password)).toBe(mockMongoUser);
      });
    });

    describe('password is invalid', async () => {
      it('should return null', async () => {
        when(mockCryptoService.compare).thenReturn(vi.fn().mockReturnValue(false));

        expect(await authService.validateUser(username, password)).toBe(null);
      });
    });

    describe('getCookieWithJwtToken', () => {
      it('should get token from jwt service', async () => {
        authService.getCookieWithJwtToken(userId);

        expect(jwtService.sign).toBeCalledWith({ userId });
      });

      it('should return cookie with token', async () => {
        const token = 'token';
        const jwtExpirationTime = 1;

        expect(authService.getCookieWithJwtToken(userId)).toBe(
          `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExpirationTime}`,
        );
      });
    });

    describe('createUser', () => {
      describe('crypto service success', () => {
        it('should get hashed password from crypto service', async () => {
          await authService.createUser(mockUpsertUser);

          expect(cryptoService.hash).toBeCalledWith(password, 10);
        });

        it('should create user', async () => {
          await authService.createUser(mockUpsertUser);

          expect(userService.create).toBeCalledWith({
            ...mockUpsertUser,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          when(mockCryptoService.hash).thenThrow(error);
          expect.assertions(1);

          try {
            await authService.createUser(mockUpsertUser);
          } catch (e) {
            expect(e).toBe(error);
          }
        });
      });

      describe('user service success', () => {
        it('should return created user', async () => {
          expect(await authService.createUser(mockUpsertUser)).toBe(mockMongoUser);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          when(mockUserService.create).thenThrow(error);
          expect.assertions(1);

          try {
            await authService.createUser(mockUpsertUser);
          } catch (e) {
            expect(e).toBe(error);
          }
        });
      });
    });

    describe('updateUser', () => {
      describe('crypto service success', () => {
        it('should get hashed password from crypto service', async () => {
          await authService.updateUser(userId, mockUpsertUser);

          expect(cryptoService.hash).toBeCalledWith(password, 10);
        });

        it('should update user', async () => {
          await authService.updateUser(userId, mockUpsertUser);

          expect(userService.update).toBeCalledWith(userId, {
            ...mockUpsertUser,
            password: hashedPassword,
          });
        });
      });

      describe('crypto service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          when(mockCryptoService.hash).thenThrow(error);
          expect.assertions(1);

          try {
            await authService.updateUser(userId, mockUpsertUser);
          } catch (e) {
            expect(e).toBe(error);
          }
        });
      });

      describe('user service success', () => {
        it('should return updated user', async () => {
          expect(await authService.updateUser(userId, mockUpsertUser)).toBe(mockUpdatedMongoUser);
        });
      });

      describe('user service error', () => {
        it('should throw error', async () => {
          const error = new Error('Internal Error');
          when(mockUserService.update).thenThrow(error);
          expect.assertions(1);

          try {
            await authService.updateUser(userId, mockUpsertUser);
          } catch (e) {
            expect(e).toBe(error);
          }
        });
      });
    });
  });
});
