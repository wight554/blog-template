import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { createMockMongoError } from '@test/server/mockUtils';
import { UserService } from '@server/user/UserService';
import { User, UserDocument } from '@server/user/schemas/UserSchema';
import { MongoErrorCode } from '@server/enums/MongoErrorCode';
import { CryptoService } from '@server/crypto/CryptoService';
import {
  mockUserModel,
  mockUpsertUser,
  mockMongoUser,
  mockUpdatedMongoUser,
} from '@test/server/user/mocks';

const userId = '1';
const username = 'username';
const password = 'password';
const hashedPassword = 'hashedPassword';
let cryptoService: CryptoService;

describe('UserService', () => {
  let userModel: Model<UserDocument>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
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

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    userService = module.get<UserService>(UserService);
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  describe('create', () => {
    it('should get hashed password from crypto service', async () => {
      await userService.create(mockUpsertUser);

      expect(cryptoService.hash).toBeCalledWith(password, 10);
    });

    describe('crypto service error', () => {
      it('should throw internal server error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(cryptoService, 'hash').mockRejectedValueOnce(error);
        expect.assertions(1);

        await expect(userService.create(mockUpsertUser)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    it('should create user using user model', async () => {
      await userService.create(mockUpsertUser);

      expect(userModel.create).toHaveBeenCalledWith({
        ...mockUpsertUser,
        password: hashedPassword,
      });
    });

    describe('user model success', () => {
      it('should return created user', async () => {
        expect(await userService.create(mockUpsertUser)).toEqual(mockMongoUser);
      });
    });

    describe('user model error', () => {
      describe('error is mongo duplicate key error', () => {
        it('should throw bad request exception', async () => {
          const error = createMockMongoError(MongoErrorCode.DuplicateKey);
          vi.spyOn(userModel, 'create').mockRejectedValueOnce(error);

          await expect(userService.create(mockUpsertUser)).rejects.toThrowError(
            BadRequestException,
          );
        });
      });

      describe('error is not duplicate key error', () => {
        it('should throw internal server error exception', async () => {
          const error = new Error();
          vi.spyOn(userModel, 'create').mockRejectedValueOnce(error);

          await expect(userService.create(mockUpsertUser)).rejects.toThrowError(
            InternalServerErrorException,
          );
        });
      });
    });
  });

  describe('update', () => {
    it('should get hashed password from crypto service', async () => {
      await userService.update(userId, mockUpsertUser);

      expect(cryptoService.hash).toBeCalledWith(password, 10);
    });

    describe('crypto service error', () => {
      it('should throw internal server error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(cryptoService, 'hash').mockRejectedValueOnce(error);
        expect.assertions(1);

        await expect(userService.update(userId, mockUpsertUser)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    it('should update user using user model', async () => {
      await userService.update(userId, mockUpsertUser);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          ...mockUpsertUser,
          password: hashedPassword,
        },
        {
          new: true,
        },
      );
    });

    describe('user exists', () => {
      describe('user model success', () => {
        it('should return updated user', async () => {
          expect(await userService.update(userId, mockUpsertUser)).toEqual(mockUpdatedMongoUser);
        });
      });

      describe('user model error', () => {
        describe('error is mongo duplicate key error', () => {
          it('should throw bad request exception', async () => {
            const error = createMockMongoError(MongoErrorCode.DuplicateKey);
            vi.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValueOnce(error);

            await expect(userService.update(userId, mockUpsertUser)).rejects.toThrowError(
              BadRequestException,
            );
          });
        });

        describe('error is not duplicate key error', () => {
          it('should throw internal server error exception', async () => {
            const error = new Error();
            vi.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValueOnce(error);

            await expect(userService.update(userId, mockUpsertUser)).rejects.toThrowError(
              InternalServerErrorException,
            );
          });
        });
      });
    });

    describe('user does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

        await expect(userService.update(userId, mockUpsertUser)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });

  describe('getByUsername', () => {
    it('should get user by username using user model', async () => {
      await userService.getByUsername(username);

      expect(userModel.findOne).toHaveBeenCalledWith({ username });
    });

    describe('user exists', () => {
      it('should return user', async () => {
        expect(await userService.getByUsername(username)).toEqual(mockMongoUser);
      });
    });

    describe('user does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

        await expect(userService.getByUsername(username)).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('getById', () => {
    it('should get user by id using user model', async () => {
      await userService.getById(userId);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
    });

    describe('user exists', () => {
      it('should return user', async () => {
        expect(await userService.getById(userId)).toEqual(mockMongoUser);
      });
    });

    describe('user does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

        await expect(userService.getById(userId)).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
