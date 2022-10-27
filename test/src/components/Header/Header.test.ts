import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { snackbarAtom } from 'src/atoms/snackbar.js';

import { Header } from '#src/components/Header/index.js';
import * as userService from '#src/services/user.js';
import {
  cleanup,
  fireEvent,
  queryClient,
  render,
  rest,
  screen,
  server,
  waitFor,
} from '#test/src/testUtils/index.js';

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
          vi.spyOn(userService, 'logoutUser');

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
            expect(userService.logoutUser).toHaveBeenCalled();
          });
        });

        it('should render loading spinner while logging out', async () => {
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
            expect(avatar).toHaveAttribute('aria-busy', 'true');
          });

          await waitFor(() => {
            expect(avatar).toHaveAttribute('aria-busy', 'false');
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

        describe('logout success', () => {
          it('should set user to null', async () => {
            vi.spyOn(queryClient, 'setQueryData');

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
              expect(queryClient.setQueryData).toBeCalledWith(userService.userQuery.queryKey, null);
            });
          });
        });

        describe('logout error', () => {
          it('should close user menu', async () => {
            vi.spyOn(snackbarAtom, 'write');
            server.use(
              rest.post('*/api/v1/auth/logout', (_req, res, ctx) => {
                return res.once(
                  ctx.status(StatusCodes.INTERNAL_SERVER_ERROR),
                  ctx.json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR }),
                );
              }),
            );
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
              expect(snackbarAtom.write).toBeCalledWith(expect.anything(), expect.anything(), {
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                open: true,
                severity: 'error',
              });
            });
          });
        });
      });
    });
  });

  describe('user is not authenticated', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/v1/users', (_req, res, ctx) => {
          return res.once(ctx.status(StatusCodes.UNAUTHORIZED));
        }),
      );
    });

    it('should render avatar based on generic username', async () => {
      render(html`<${Header} />`);

      await waitFor(() => {
        expect(screen.getByText('U')).toBeInTheDocument();
      });
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
