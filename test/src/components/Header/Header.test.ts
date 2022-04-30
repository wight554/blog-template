const mockGetUser = vi.fn().mockResolvedValue([{ id: '1', username: 'TestUser' }, null]);
const mockLogoutUser = vi.fn().mockResolvedValue([{}, null]);

vi.mock('@src/services/user', () => ({
  getUser: mockGetUser,
  logoutUser: mockLogoutUser,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Fragment } from 'preact';

import { createHttpError } from '@src/api/httpError';
import { Header } from '@src/components/Header';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';
import { render, screen, fireEvent, waitFor, cleanup, RecoilObserver } from '@test/src/testUtils';

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

          expect(mockLogoutUser).toHaveBeenCalled();
        });

        describe('user service success', () => {
          it('should set user state to null', async () => {
            const onChange = vi.fn();

            render(html`<${Fragment}>
              <${RecoilObserver} node=${userInfoState} onChange=${onChange} />
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
              expect(onChange).toHaveBeenCalledWith(null);
            });
          });
        });

        describe('user service error', () => {
          it('should set snackbar state to error', async () => {
            mockLogoutUser.mockResolvedValueOnce([
              null,
              createHttpError(StatusCodes.INTERNAL_SERVER_ERROR),
            ]);
            const onChange = vi.fn();

            render(html`<${Fragment}>
              <${RecoilObserver} node=${snackbarState} onChange=${onChange} />
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
              expect(onChange).toHaveBeenCalledWith({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                open: true,
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
    it('should render avatar based on generic username', async () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

      render(html`<${Header} />`);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    describe('user menu is opened', () => {
      it('should render login menu item', async () => {
        mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

        render(html`<${Header} />`);

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        expect(screen.getByText('Login')).toBeVisible();
      });

      it('should render sign-up menu item', async () => {
        mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

        render(html`<${Header} />`);

        const avatar = screen.getByLabelText('open user menu');

        fireEvent.click(avatar);

        await waitFor(() => {
          expect(screen.getByRole('presentation')).toBeInTheDocument();
        });

        expect(screen.getByText('Sign-up')).toBeVisible();
      });

      describe('login click', () => {
        it('should close user menu', async () => {
          mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

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
          mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

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
