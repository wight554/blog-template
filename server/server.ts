import * as express from 'express';
import { Request, Response, Application } from 'express';

const createServer = async (): Promise<Application> => {
  const app = express();

  app.get('/ping', (_: Request, res: Response) => res.status(200).send('PONG'));

  if (process.env.NODE_ENV !== 'production') {
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
  }

  app.use(express.static('./dist/public'));

  return app;
};

const port = process.env.PORT || 3000;

createServer().then((app) => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
});

export default createServer;
