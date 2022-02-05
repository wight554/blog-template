import { render, screen } from '@testing-library/preact';
import { expect, it } from 'vitest';

import { App } from '@src/app';

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/Hello Vite \+ Preact!/i)).toBeDefined();
  });
});
