import { App } from '@src/app';
import { render, screen } from '@test/src/testUtils';

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeInTheDocument();
  });
});
