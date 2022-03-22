import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@server/auth/AuthService';
import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { mockMongoUser, mockUpdatedMongoUser } from '@test/server/user/mocks';

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
            signAsync: vi.fn().mockReturnValue(token),
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
        await authService.getCookieWithJwtToken(userId);

        expect(jwtService.signAsync).toBeCalledWith({ userId });
      });

      it('should return cookie with token', async () => {
        const token = 'token';
        const jwtExpirationTime = 1;

        expect(await authService.getCookieWithJwtToken(userId)).toBe(
          `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExpirationTime}`,
        );
      });
    });
  });
});
