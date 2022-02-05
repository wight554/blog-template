import { Module } from '@nestjs/common';

import { CryptoService } from '@server/crypto/CryptoService';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
