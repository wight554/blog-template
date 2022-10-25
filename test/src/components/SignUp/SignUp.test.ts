import { mockUser } from '#test/src/mocks/index.js';

const mockSignUpUser = vi.fn().mockResolvedValue({ data: mockUser });
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
  ...vi.importActual('#src/services/user.js'),
  signUpUser: mockSignUpUser,
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
  AuthFormField: ({ name = '' }) => html` <div>${name}</div> `,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError.js';
import { SignUp } from '#src/components/SignUp/index.js';
import { cleanup, fireEvent, render, screen, waitFor } from '#test/src/testUtils/index.js';

describe('SignUp', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render form title', async () => {
    render(html`<${SignUp} />`);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should render first name field', async () => {
    render(html`<${SignUp} />`);

    expect(screen.getByText('firstName')).toBeInTheDocument();
  });

  it('should render last name field', async () => {
    render(html`<${SignUp} />`);

    expect(screen.getByText('lastName')).toBeInTheDocument();
  });

  it('should render username field', async () => {
    render(html`<${SignUp} />`);

    expect(screen.getByText('password')).toBeInTheDocument();
  });

  it('should render password field', async () => {
    render(html`<${SignUp} />`);

    expect(screen.getByText('password')).toBeInTheDocument();
  });

  describe('submit button clicked', () => {
    describe('sign-up successful', () => {
      it('should navigate to login page', async () => {
        render(html` <${SignUp} /> `);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith('/login');
        });
      });
    });

    describe('sign-up error', () => {
      it('should render snackbar with error', async () => {
        mockSignUpUser.mockRejectedValueOnce(createHttpError(StatusCodes.UNAUTHORIZED));

        render(html`<${SignUp} />`);

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
