import { render, screen } from '@testing-library/preact';
import { html } from 'htm/preact';
import { App } from '@src/components/App';

vi.mock('@src/components/Header', () => () => ({
  Header: html`<div></div>`,
}));

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeDefined();
  });
});
