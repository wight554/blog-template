import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@server/auth/AuthService';
import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockUpdatedMongoUser } from '@test/server/user/mocks/mockUpdatedMongoUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';

const userId = '1';
const username = 'username';
const password = 'password';
const token = 'token';
const jwtExpirationTime = 1;
const hashedPassword = 'hashedPassword';

describe('AuthService', () => {
  let jwtService: JwtService;
  let userService: UserService;
  let cryptoService: CryptoService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue(token),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue(jwtExpirationTime),
          },
        },
        {
          provide: UserService,
          useValue: {
            getByUsername: vi.fn().mockResolvedValue(mockMongoUser),
            create: vi.fn().mockResolvedValue(mockMongoUser),
            update: vi.fn().mockResolvedValue(mockUpdatedMongoUser),
          },
        },
        {
          provide: CryptoService,
          useValue: {
            compare: vi.fn().mockResolvedValue(true),
            hash: vi.fn().mockResolvedValue(hashedPassword),
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    cryptoService = module.get<CryptoService>(CryptoService);
    authService = module.get<AuthService>(AuthService);
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
        vi.spyOn(cryptoService, 'compare').mockResolvedValueOnce(false);

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
          vi.spyOn(cryptoService, 'hash').mockRejectedValueOnce(error);
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
          vi.spyOn(userService, 'create').mockRejectedValueOnce(error);
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
          vi.spyOn(cryptoService, 'hash').mockRejectedValueOnce(error);
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
          vi.spyOn(userService, 'update').mockRejectedValueOnce(error);
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
