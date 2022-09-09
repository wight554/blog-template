const mockUser = { id: '1', username: 'Username 1' };
const mockSignUpUser = vi.fn().mockResolvedValue([mockUser, null]);
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

vi.mock('#src/services/user', () => ({
  signUpUser: mockSignUpUser,
}));

vi.mock('#src/components/AuthFormContainer', () => ({
  AuthFormContainer: ({ title = '', children = null, onSubmit = () => {} }) =>
    html`
      <div>
        ${title} ${children}
        <button role="button" onclick=${onSubmit} />
      </div>
    `,
}));

vi.mock('#src/components/AuthFormField', () => ({
  AuthFormField: ({ name = '' }) => html` <div>${name}</div> `,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError';
import { SignUp } from '#src/components/SignUp';
import { snackbarState } from '#src/store/snackbarState';
import { cleanup, fireEvent, RecoilObserver, render, screen, waitFor } from '#test/src/testUtils';

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
        mockSignUpUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.BAD_REQUEST)]);

        const onChange = vi.fn();

        render(html`
          <${RecoilObserver} node=${snackbarState} onChange=${onChange} />
          <${SignUp} />
        `);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(onChange).toBeCalledWith({
            message: ReasonPhrases.BAD_REQUEST,
            open: true,
          });
        });
      });
    });
  });
});
