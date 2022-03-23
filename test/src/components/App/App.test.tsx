import { html } from 'htm/preact';
import { App } from '@src/components/App';
import { render, screen } from '@test/src/testUtils';

vi.mock('@src/components/Header', () => () => ({
  Header: html`<div></div>`,
}));

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeDefined();
  });
});
