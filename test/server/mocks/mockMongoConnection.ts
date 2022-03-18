export const mockMongoConnection = {
  startSession: vi.fn().mockImplementation(() => ({
    startTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    endSession: vi.fn(),
  })),
};
