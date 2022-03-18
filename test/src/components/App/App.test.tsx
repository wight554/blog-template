import { render, screen } from '@testing-library/preact';

vi.mock('@src/components/Header', () => () => ({
  Header: <div>aaa</div>,
}));

import { App } from '@src/components/App';

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeDefined();
  });
});
