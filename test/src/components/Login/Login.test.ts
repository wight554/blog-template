const mockNavigate = vi.fn();
const mockSetSnackBar = vi.fn();
const mockUseAtom = vi.fn().mockReturnValue([undefined, mockSetSnackBar]);

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

vi.mock('jotai', () => ({
  atom: vi.fn(),
  useAtom: mockUseAtom,
}));

vi.mock('#src/components/AuthFormContainer/index.js', () => ({
  AuthFormContainer: ({ title = '', children = null, onSubmit = () => {} }) =>
    html`
      <div>
        ${title} ${children}
        <button role="button" onClick=${() => onSubmit()} />
      </div>
    `,
}));

vi.mock('#src/components/AuthFormField/index.js', () => ({
  AuthFormField: ({ name = '' }) => html`<div>${name}</div>`,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { Login } from '#src/components/Login/index.js';
import * as userService from '#src/services/user.js';
import {
  cleanup,
  fireEvent,
  render,
  rest,
  screen,
  server,
  waitFor,
} from '#test/src/testUtils/index.js';

describe('Login', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render form title', async () => {
    render(html`<${Login} />`);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should render username field', async () => {
    render(html`<${Login} />`);

    expect(screen.getByText('password')).toBeInTheDocument();
  });

  it('should render password field', async () => {
    render(html`<${Login} />`);

    expect(screen.getByText('password')).toBeInTheDocument();
  });

  describe('submit button clicked', () => {
    describe('login successful', () => {
      describe('response is empty', () => {
        it('should not navigate to home page', async () => {
          server.use(
            rest.post('*/api/v1/auth/login', (_req, res, ctx) => {
              return res(ctx.status(StatusCodes.OK));
            }),
          );

          render(html`<${Login} />`);

          const submit = screen.getByRole('button');

          fireEvent.click(submit);

          await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
          });
        });
      });

      describe('response is not empty', () => {
        it('should navigate to home page', async () => {
          render(html`<${Login} />`);

          const submit = screen.getByRole('button');

          fireEvent.click(submit);

          await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
          });
        });
      });
    });

    describe('login error', () => {
      describe('error is http error', () => {
        it('should render snackbar with error', async () => {
          server.use(
            rest.post('*/api/v1/auth/login', (_req, res, ctx) => {
              return res(
                ctx.status(StatusCodes.UNAUTHORIZED),
                ctx.json({ message: ReasonPhrases.UNAUTHORIZED }),
              );
            }),
          );

          render(html`<${Login} />`);

          const submit = screen.getByRole('button');

          fireEvent.click(submit);

          await waitFor(() => {
            expect(mockSetSnackBar).toHaveBeenCalledWith({
              message: ReasonPhrases.UNAUTHORIZED,
              open: true,
              severity: 'error',
            });
          });
        });
      });

      describe('error is not http error', () => {
        it('should not render snackbar with error', async () => {
          const loginUserSpy = vi.spyOn(userService, 'loginUser');
          const error = new Error();

          loginUserSpy.mockRejectedValueOnce(error);

          render(html`<${Login} />`);

          const submit = screen.getByRole('button');

          fireEvent.click(submit);

          await waitFor(() => {
            expect(mockSetSnackBar).not.toHaveBeenCalled();
          });

          loginUserSpy.mockClear();
        });
      });
    });
  });
});
