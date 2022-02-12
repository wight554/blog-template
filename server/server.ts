const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('alias-hq').get('module-alias');
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from 'fastify-cookie';

import { AppModule } from '@server/app/AppModule';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.register(fastifyCookie);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getViteServer } = require('@server/get-vite-server');

    const vite = await getViteServer();

    app.use(/^(?!\/api\/.*)/, vite.middlewares);
  } else {
    app.useStaticAssets({ root: './dist/public' });
  }

  await app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
}

bootstrap();

export default bootstrap;
