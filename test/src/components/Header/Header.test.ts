import { mockUser } from '#test/src/mocks/index.js';

const mockLogoutUser = vi.fn().mockResolvedValue(undefined);
const mockUseUser = vi.fn().mockReturnValue({});
const mockUserQuery = {
  queryKey: ['user'],
};
const mockSetSnackBar = vi.fn();
const mockUseAtom = vi.fn().mockReturnValue([undefined, mockSetSnackBar]);
const mockQueryClient = {
  setQueryData: vi.fn(),
};
const mockUseQueryClient = vi.fn().mockReturnValue(mockQueryClient);

vi.mock('jotai', () => ({
  atom: vi.fn(),
  useAtom: mockUseAtom,
}));

vi.mock('@tanstack/react-query', async () => {
  const reactQuery: typeof import('@tanstack/react-query') = await vi.importActual(
    '@tanstack/react-query',
  );
  return {
    ...reactQuery,
    useQueryClient: mockUseQueryClient,
  };
});

vi.mock('#src/services/user.js', () => ({
  userQuery: mockUserQuery,
  useUser: mockUseUser,
  logoutUser: mockLogoutUser,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Fragment } from 'preact';

import { createHttpError } from '#src/api/httpError.js';
import { Header } from '#src/components/Header/index.js';
import { cleanup, fireEvent, render, screen, waitFor } from '#test/src/testUtils/index.js';

describe('Header', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

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

  describe('user is authenticated', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: { ...mockUser, username: 'test_user' },
      });
    });
    afterEach(() => {
      mockUseUser.mockClear();
    });

    it('should render avatar based on username', async () => {
      render(html`<${Header} />`);

      await waitFor(() => {
        expect(screen.getByText('T')).toBeInTheDocument();
      });
    });

    describe('user menu is opened', () => {
      it('should render profile menu item', async () => {
        render(html`<${Header} />`);

        await waitFor(() => {
          expect(screen.getByText('T')).toBeInTheDocument();
        });

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        expect(screen.getByText('Profile')).toBeVisible();
      });

      it('should render logout menu item', async () => {
        render(html`<${Header} />`);

        await waitFor(() => {
          expect(screen.getByText('T')).toBeInTheDocument();
        });

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        expect(screen.getByText('Logout')).toBeVisible();
      });

      describe('profile click', () => {
        it('should close user menu', async () => {
          render(html`<${Header} />`);

          await waitFor(() => {
            expect(screen.getByText('T')).toBeInTheDocument();
          });

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const profile = screen.getByText('Profile');

          fireEvent.click(profile);

          await waitFor(() => {
            expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
          });
        });
      });

      describe('logout click', () => {
        it('should trigger user service logout action', async () => {
          render(html`<${Header} />`);

          await waitFor(() => {
            expect(screen.getByText('T')).toBeInTheDocument();
          });

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const logout = screen.getByText('Logout');

          fireEvent.click(logout);

          await waitFor(() => {
            expect(mockLogoutUser).toHaveBeenCalled();
          });
        });

        describe('user service success', () => {
          it('should set user state to null', async () => {
            render(html`<${Fragment}>
              <${Header} />
            <//>`);

            await waitFor(() => {
              expect(screen.getByText('T')).toBeInTheDocument();
            });

            const avatar = screen.getByLabelText('open user menu');

            fireEvent.click(avatar);

            await waitFor(() => {
              expect(screen.getByRole('presentation')).toBeInTheDocument();
            });

            const logout = screen.getByText('Logout');

            fireEvent.click(logout);

            await waitFor(() => {
              expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
                mockUserQuery.queryKey,
                null,
              );
            });
          });
        });

        describe('user service error', () => {
          it('should set snackbar state to error', async () => {
            mockLogoutUser.mockRejectedValue(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR));

            render(html`<${Fragment}>
              <${Header} />
            <//>`);

            await waitFor(() => {
              expect(screen.getByText('T')).toBeInTheDocument();
            });

            const avatar = screen.getByLabelText('open user menu');

            fireEvent.click(avatar);

            await waitFor(() => {
              expect(screen.getByRole('presentation')).toBeInTheDocument();
            });

            const logout = screen.getByText('Logout');

            fireEvent.click(logout);

            await waitFor(() => {
              expect(mockSetSnackBar).toHaveBeenCalledWith({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                open: true,
                severity: 'error',
              });
            });
          });
        });

        it('should close user menu', async () => {
          render(html`<${Header} />`);

          await waitFor(() => {
            expect(screen.getByText('T')).toBeInTheDocument();
          });

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const logout = screen.getByText('Logout');

          fireEvent.click(logout);

          await waitFor(() => {
            expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('user is not authenticated', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: null,
      });
    });
    afterEach(() => {
      mockUseUser.mockClear();
    });

    it('should render avatar based on generic username', async () => {
      render(html`<${Header} />`);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    describe('user menu is opened', () => {
      it('should render login menu item', async () => {
        render(html`<${Header} />`);

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(screen.getByText('Login')).toBeVisible();
        });
      });

      it('should render sign-up menu item', async () => {
        render(html`<${Header} />`);

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(screen.getByText('Sign-up')).toBeVisible();
        });
      });

      describe('login click', () => {
        it('should close user menu', async () => {
          render(html`<${Header} />`);

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const login = screen.getByText('Login');

          fireEvent.click(login);

          await waitFor(() => {
            expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
          });
        });

        it('should redirect to login page', async () => {
          render(html`<${Header} />`);

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const login = screen.getByText('Login');

          fireEvent.click(login);

          expect(window.location.pathname).toBe('/login');
        });
      });

      describe('sign-up click', () => {
        it('should close user menu', async () => {
          render(html`<${Header} />`);

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const signUp = screen.getByText('Sign-up');

          fireEvent.click(signUp);

          await waitFor(() => {
            expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
          });
        });

        it('should redirect to sign-up page', async () => {
          render(html`<${Header} />`);

          const avatar = screen.getByLabelText('open user menu');

          fireEvent.click(avatar);

          await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument();
          });

          const signUp = screen.getByText('Sign-up');

          fireEvent.click(signUp);

          expect(window.location.pathname).toBe('/sign-up');
        });
      });
    });
  });
});
