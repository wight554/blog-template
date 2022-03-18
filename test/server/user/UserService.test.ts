import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserService } from '@server/user/UserService';
import { User, UserDocument } from '@server/user/schemas/UserSchema';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MongoErrorException } from '@test/utils/errors/MongoErrorException';
import { MongoError } from '@server/enums/MongoError';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockUpdatedMongoUser } from '@test/server/user/mocks/mockUpdatedMongoUser';
import { mockUpsertUser } from '@test/server/user/mocks/mockUpsertUser';
import { mockUserModel } from '@test/server/user/mocks/mockUserModel';

const userId = '1';
const username = 'username';

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
      ],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create user using user model', async () => {
      await userService.create(mockUpsertUser);

      expect(userModel.create).toHaveBeenCalledWith(mockUpsertUser);
    });

    describe('user model success', () => {
      it('should return created user', async () => {
        expect(await userService.create(mockUpsertUser)).toEqual(mockMongoUser);
      });
    });

    describe('user model error', () => {
      describe('error is duplicate key error', () => {
        it('should throw bad request exception', async () => {
          const error = new MongoErrorException(MongoError.DuplicateKey);
          vi.spyOn(userModel, 'create').mockRejectedValueOnce(error);

          try {
            await userService.create(mockUpsertUser);
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
          }
        });
      });

      describe('error is not duplicate key error', () => {
        it('should throw internal server error exception', async () => {
          const error = new Error();
          vi.spyOn(userModel, 'create').mockRejectedValueOnce(error);

          try {
            await userService.create(mockUpsertUser);
          } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
          }
        });
      });
    });
  });

  describe('update', () => {
    it('should update user using user model', async () => {
      await userService.update(userId, mockUpsertUser);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, mockUpsertUser, {
        new: true,
      });
    });

    describe('user exists', () => {
      describe('user model success', () => {
        it('should return updated user', async () => {
          expect(await userService.update(userId, mockUpsertUser)).toEqual(mockUpdatedMongoUser);
        });
      });

      describe('user model error', () => {
        describe('error is duplicate key error', () => {
          it('should throw bad request exception', async () => {
            const error = new MongoErrorException(MongoError.DuplicateKey);
            vi.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValueOnce(error);

            try {
              await userService.update(userId, mockUpsertUser);
            } catch (error) {
              expect(error).toBeInstanceOf(BadRequestException);
            }
          });
        });

        describe('error is not duplicate key error', () => {
          it('should throw internal server error exception', async () => {
            const error = new Error();
            vi.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValueOnce(error);

            try {
              await userService.update(userId, mockUpsertUser);
            } catch (error) {
              expect(error).toBeInstanceOf(InternalServerErrorException);
            }
          });
        });
      });
    });

    describe('user does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

        try {
          await userService.update(userId, mockUpsertUser);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
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

        try {
          await userService.getByUsername(username);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
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

        try {
          await userService.getById(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
