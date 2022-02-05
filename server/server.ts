const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('alias-hq').get('module-alias');
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@server/app/AppModule';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getViteServer } = require('@server/get-vite-server');

    const vite = await getViteServer();

    app.use(/^(?!\/api\/.*)/, vite.middlewares);
  } else {
    app.useStaticAssets('./dist/public');
  }

  await app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
}

bootstrap();

export default bootstrap;
