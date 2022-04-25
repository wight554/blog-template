import { CryptoService } from '@server/crypto/CryptoService.js';

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
      expect(await cryptoService.compare('a', 'b')).toEqual(true);
    });
  });

  describe('hash', () => {
    it('should return hashed string', async () => {
      expect(await cryptoService.hash('a', 10)).toEqual(hashedString);
    });
  });
});
