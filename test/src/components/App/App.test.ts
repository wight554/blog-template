import { html } from 'htm/preact';

import { App } from '@src/components/App';
import { render, screen } from '@test/src/testUtils';

vi.mock('@src/api/httpClient', () => ({
  httpClient: {
    get: vi.fn().mockResolvedValue({
      data: {
        username: 'username',
        id: '1',
      },
    }),
    post: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('App', () => {
  it('should render title', () => {
    render(html`<${App} />`);
    expect(screen.getByText(/Hello User!/i)).toBeInTheDocument();
  });
});
