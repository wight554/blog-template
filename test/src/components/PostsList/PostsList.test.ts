vi.mock('#src/components/PostCard/index.js', () => ({
  PostCard: () => html` <div>PostCard</div> `,
}));

import { html } from 'htm/preact';

import { PostsList } from '#src/components/PostsList/index.js';
import { cleanup, render, screen, waitFor } from '#test/src/testUtils/index.js';

describe('PostsList', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('posts are loaded', () => {
    it('should render list of post cards', async () => {
      render(html`<${PostsList} />`);

      await waitFor(() => {
        expect(screen.getAllByText('PostCard')).toHaveLength(2);
      });
    });
  });

  describe('posts are loading', () => {
    it('should render list of 10 skeleton post cards', async () => {
      render(html`<${PostsList} />`);

      await waitFor(() => {
        expect(screen.getAllByText('PostCard')).toHaveLength(2);
      });
    });
  });
});
