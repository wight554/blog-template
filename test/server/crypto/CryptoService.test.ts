import { CryptoService } from '@server/crypto/CryptoService';

const comparisonResult = true;
const hashedString = 'hashedString';

vi.mock('bcrypt', () => ({
  compare: () => comparisonResult,
  hash: () => hashedString,
}));

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
  });

  describe('compare', () => {
    it('should return comparison result', async () => {
      expect(cryptoService.compare('a', 'b')).toEqual(comparisonResult);
    });
  });

  describe('hash', () => {
    it('should return hashed string', async () => {
      expect(cryptoService.hash('a', 10)).toEqual(hashedString);
    });
  });
});
