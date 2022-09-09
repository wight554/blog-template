const mockDate = vi.fn().mockReturnValue('formatted date');

vi.mock('date-fns', () => ({
  format: mockDate,
}));

import { html } from 'htm/preact';

import { PostCard } from '#src/components/PostCard/index.js';
import { mockPost } from '#test/src/mocks/index.js';
import { cleanup, render, screen } from '#test/src/testUtils/index.js';

describe('PostCard', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
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
