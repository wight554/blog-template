import { html } from 'htm/preact';

import { Header } from '@src/components/Header/index.js';
import { render, screen, fireEvent, waitFor } from '@test/src/testUtils/index.js';

describe('Header', () => {
  it('should render app title', () => {
    render(html`<${Header} />`);

    expect(screen.getByText(/Blog demo/i)).toBeInTheDocument();
  });

  it('should render avatar', () => {
    render(html`<${Header} />`);

    expect(screen.getByLabelText('open user menu')).toBeInTheDocument();
  });

  it('should render hidden menu', () => {
    render(html`<${Header} />`);

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('should open menu when avatar is clicked', async () => {
    render(html`<${Header} />`);

    const avatar = screen.getByLabelText('open user menu');

    fireEvent.click(avatar);

    await waitFor(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
  });

  it('should close menu when menu item is clicked', async () => {
    render(html`<${Header} />`);

    const avatar = screen.getByLabelText('open user menu');

    fireEvent.click(avatar);

    await waitFor(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    const menuItem = screen.getByText('Profile');

    fireEvent.click(menuItem);

    await waitFor(() => {
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });
});
