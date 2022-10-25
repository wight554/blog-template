import { mockUser } from '#test/src/mocks/index.js';

const mockLoginUser = vi.fn().mockResolvedValue({ data: mockUser });
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

vi.mock('#src/services/user.js', () => ({
  loginUser: mockLoginUser,
}));

vi.mock('#src/components/AuthFormContainer/index.js', () => ({
  AuthFormContainer: ({ title = '', children = null, onSubmit = () => {} }) =>
    html`
      <div>
        ${title} ${children}
        <button role="button" onClick=${onSubmit} />
      </div>
    `,
}));

vi.mock('#src/components/AuthFormField/index.js', () => ({
  AuthFormField: ({ name = '' }) => html`<div>${name}</div>`,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError.js';
import { Login } from '#src/components/Login/index.js';
import { cleanup, fireEvent, render, screen, waitFor } from '#test/src/testUtils/index.js';

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
      it('should navigate to home page', async () => {
        render(html`<${Login} />`);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith('/');
        });
      });
    });

    describe('login error', () => {
      it('should render snackbar with error', async () => {
        mockLoginUser.mockRejectedValueOnce(createHttpError(StatusCodes.UNAUTHORIZED));

        render(html`<${Login} />`);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(mockSetSnackBar).toBeCalledWith({
            message: ReasonPhrases.UNAUTHORIZED,
            open: true,
            severity: 'error',
          });
        });
      });
    });
  });
});
