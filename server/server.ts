import 'reflect-metadata';
import { fileURLToPath } from 'url';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookiePlugin from 'fastify-cookie';
import { default as fastifyStatic } from 'fastify-static';

import { AppModule } from '@server/app/AppModule.js';
import { prettyPrintAddress } from '@server/utils/prettyPrintAddress.js';

const { fastifyCookie } = fastifyCookiePlugin;

const { PORT, HOST } = process.env;
const port = PORT || 3000;
const host = HOST || '0.0.0.0';

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

app.register(fastifyCookie);

app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

if (process.env.NODE_ENV !== 'production') {
  import('@server/getViteServer.js').then(async ({ getViteServer }) => {
    const vite = await getViteServer();

    app.use(/^(?!\/api\/.*)/, vite.middlewares);
  });
} else {
  app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../public', import.meta.url)),
  });
}

await app.listen(port, host, (_, address) => {
  prettyPrintAddress(address);
});
