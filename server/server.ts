import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from 'fastify-cookie';
import fastifyStatic from 'fastify-static';
import { join } from 'path';

import { AppModule } from '@server/app/AppModule';
import { prettyPrintAddress } from '@server/utils/prettyPrintAddress';

const { PORT, HOST } = process.env;
const port = PORT || 3000;
const host = HOST || '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.register(fastifyCookie);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getViteServer } = require('@server/getViteServer');

    const vite = await getViteServer();

    app.use(/^(?!\/api\/.*)/, vite.middlewares);
  } else {
    app.register(fastifyStatic, {
      root: join(__dirname, '../public'),
    });
  }

  await app.listen(port, host, (_, address) => {
    prettyPrintAddress(address);
  });
}

bootstrap();

export default bootstrap;
