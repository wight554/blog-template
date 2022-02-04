import { Module } from '@nestjs/common';
import { PostModule } from '@server/module/PostModule';

@Module({
  imports: [PostModule],
})
export class AppModule {}
