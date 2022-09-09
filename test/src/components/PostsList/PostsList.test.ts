// eslint-disable-next-line import/order
import { mockPost } from '#test/src/mocks/index.js';

const mockGetPosts = vi.fn().mockResolvedValue([[mockPost, { ...mockPost, id: '2' }], null]);

vi.mock('#src/services/post.js', () => ({
  getPosts: mockGetPosts,
}));

vi.mock('#src/components/PostCard/index.js', () => ({
  PostCard: () => html` <div>PostCard</div> `,
}));

import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError.js';
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
    it('should not render list of post cards', () => {
      mockGetPosts.mockResolvedValueOnce([
        null,
        createHttpError(StatusCodes.INTERNAL_SERVER_ERROR),
      ]);

      render(html`<${PostsList} />`);

      expect(screen.queryByText('PostCard')).not.toBeInTheDocument();
    });
  });
});
