const mockDate = vi.fn().mockReturnValue('formatted date');

vi.mock('date-fns', () => ({
  format: mockDate,
}));

vi.mock('@mui/material', async () => {
  const mui: Record<string, unknown> = await vi.importActual('@mui/material');

  return { ...mui, Skeleton: () => html` <div>Skeleton</div> ` };
});

import { html } from 'htm/preact';

import { PostCard } from '#src/components/PostCard/index.js';
import { mockPost } from '#test/src/mocks/index.js';
import { cleanup, render, screen } from '#test/src/testUtils/index.js';

describe('PostCard', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('post is in loading state', () => {
    it('should render skeletons for all fields', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.getAllByText('Skeleton')).toHaveLength(6);
    });

    it('should not render author avatar based on username', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.queryByText('U')).not.toBeInTheDocument();
    });

    it('should not render post title', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.queryByText('post title')).not.toBeInTheDocument();
    });

    it('should not render post description', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.queryByText('post description')).not.toBeInTheDocument();
    });

    it('should not render formatted creation date', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.queryByText('formatted date')).not.toBeInTheDocument();
    });

    it('should not render placeholder image', () => {
      render(html`<${PostCard} ...${mockPost} loading />`);

      expect(screen.queryByText('placeholder')).not.toBeInTheDocument();
    });
  });

  describe('post is not in loading state', () => {
    it('should not render skeletons for all fields', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.queryAllByText('Skeleton')).not.toHaveLength(6);
    });

    it('should render author avatar based on username', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('should render post title', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.getByText('post title')).toBeInTheDocument();
    });

    it('should render post description', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.getByText('post description')).toBeInTheDocument();
    });

    it('should render formatted creation date', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.getByText('formatted date')).toBeInTheDocument();
    });

    it('should render placeholder image', () => {
      render(html`<${PostCard} ...${mockPost} />`);

      expect(screen.getByAltText('placeholder')).toBeInTheDocument();
    });
  });
});
