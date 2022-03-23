import { Header } from '@src/components/Header';
import { render, screen, fireEvent, waitFor } from '@test/src/testUtils';

describe('Header', () => {
  it('should render app title', () => {
    render(<Header />);

    expect(screen.getByText(/Blog demo/i)).toBeInTheDocument();
  });

  it('should render avatar', () => {
    const { container } = render(<Header />);

    expect(container.querySelector('.MuiAvatar-root')).toBeInTheDocument();
  });

  it('should render hidden menu', () => {
    const { baseElement } = render(<Header />);

    expect(baseElement.querySelector('#menu-appbar')).not.toBeVisible();
  });

  it('should open menu when avatar is clicked', async () => {
    const { baseElement, container } = render(<Header />);

    const avatar = container.querySelector('.MuiAvatar-root');

    expect(avatar).toBeInTheDocument();

    if (avatar) fireEvent.click(avatar);

    await waitFor(() => {
      expect(baseElement.querySelector('#menu-appbar')).toBeVisible();
    });
  });

  it('should close menu when menu item is clicked', async () => {
    const { baseElement, container } = render(<Header />);

    const avatar = container.querySelector('.MuiAvatar-root');

    expect(avatar).toBeInTheDocument();

    if (avatar) fireEvent.click(avatar);

    await waitFor(() => {
      expect(baseElement.querySelector('#menu-appbar')).toBeVisible();
    });

    const menuItem = screen.getByText('Profile');

    fireEvent.click(menuItem);

    await waitFor(() => {
      expect(document.getElementById('menu-appbar')).not.toBeVisible();
    });
  });
});
