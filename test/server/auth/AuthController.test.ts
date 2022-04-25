import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@server/auth/AuthController.js';
import { AuthService } from '@server/auth/AuthService.js';
import { createMockReply } from '@test/server/mockUtils/index.js';
import { mockUser, mockUpdatedUser } from '@test/server/user/mocks/index.js';

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
            getCookieWithJwtToken: vi.fn().mockResolvedValue(cookie),
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

  describe('logout', () => {
    it('should return undefined', async () => {
      expect(await authController.logout()).toBe(undefined);
    });
  });
});
