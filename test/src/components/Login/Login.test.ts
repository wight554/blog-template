const mockUser = { id: '1', username: 'Username 1' };
const mockLoginUser = vi.fn().mockResolvedValue([mockUser, null]);
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

vi.mock('#src/services/user', () => ({
  loginUser: mockLoginUser,
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
import { Login } from '#src/components/Login';
import { snackbarState } from '#src/store/snackbarState';
import { userInfoState } from '#src/store/userState';
import { render, screen, waitFor, fireEvent, cleanup, RecoilObserver } from '#test/src/testUtils';

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
      it('should render snackbar with error', async () => {
        const onChange = vi.fn();

        render(html`
          <${RecoilObserver} node=${userInfoState} onChange=${onChange} />
          <${Login} />
        `);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(onChange).toBeCalledWith(mockUser);
        });
      });

      it('should navigate to home page', async () => {
        render(html` <${Login} /> `);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(mockNavigate).toBeCalledWith('/');
        });
      });
    });

    describe('login error', () => {
      it('should render snackbar with error', async () => {
        mockLoginUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

        const onChange = vi.fn();

        render(html`
          <${RecoilObserver} node=${snackbarState} onChange=${onChange} />
          <${Login} />
        `);

        const submit = screen.getByRole('button');

        fireEvent.click(submit);

        await waitFor(() => {
          expect(onChange).toBeCalledWith({
            message: ReasonPhrases.UNAUTHORIZED,
            open: true,
          });
        });
      });
    });
  });
});
