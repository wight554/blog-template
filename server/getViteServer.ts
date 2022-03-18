import { createServer } from 'vite';

export async function getViteServer() {
  const viteDevServer = await createServer({
    clearScreen: false,
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

  return viteDevServer;
}
