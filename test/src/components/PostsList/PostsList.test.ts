import { mockPost } from '#test/src/mocks/index.js';

const mockUsePosts = vi
  .fn()
  .mockReturnValue({ data: [mockPost, { ...mockPost, id: '2' }], error: undefined });

vi.mock('#src/services/post.js', () => ({
  usePosts: mockUsePosts,
}));

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

  describe('posts are not loaded', () => {
    it('should render list of 10 skeleton post cards', () => {
      mockUsePosts.mockReturnValueOnce({
        isFetching: true,
      });

      render(html`<${PostsList} />`);

      expect(screen.getAllByText('PostCard')).toHaveLength(10);
    });
  });
});
