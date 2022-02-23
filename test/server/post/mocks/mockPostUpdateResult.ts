import { Types } from 'mongoose';

export const mockPostUpdateResult = {
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: new Types.ObjectId(),
  upsertedCount: 0,
  matchedCount: 1,
};
