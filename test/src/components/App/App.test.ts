import { html } from 'htm/preact';

import { App } from '@src/components/App/index.js';
import { render, screen } from '@test/src/testUtils/index.js';

describe('App', () => {
  it('should render title', () => {
    render(html`<${App} />`);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeInTheDocument();
  });
});
