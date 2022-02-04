const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  require('alias-hq').get('module-alias');
}

import 'reflect-metadata';
import * as express from 'express';
import { Request, Response, Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@server/container';
import '@server/controller/PostController';

const createServer = (): Application => {
  const app = express();

  app.get('/ping', (_: Request, res: Response) => res.status(200).send('PONG'));

  return app;
};

const setConfig = async (app: Application) => {
  if (isDev) {
    const { createServer: createViteServer } = require('vite');

    // Create Vite server in middleware mode.
    const vite = await createViteServer({
      server: {
        middlewareMode: 'html',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    });

    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(express.static('./dist/public'));
  }
};

const setErrorConfig = (app: Application) => {
  // @ts-ignore
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
};

const port = process.env.PORT || 3000;

const app = new InversifyExpressServer(container, null, null, createServer())
  .setConfig(setConfig)
  .setErrorConfig(setErrorConfig)
  .build()
  .listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });

export default app;
