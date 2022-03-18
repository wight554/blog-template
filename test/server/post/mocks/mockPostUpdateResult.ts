import { Types } from 'mongoose';

export const mockPostUpdateResult = {
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: new Types.ObjectId(1),
  upsertedCount: 0,
  matchedCount: 1,
};
