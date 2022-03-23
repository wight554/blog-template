import { render, screen } from '@test/src/testUtils';
import { App } from '@src/app';

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeInTheDocument();
  });
});
