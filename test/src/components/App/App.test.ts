// eslint-disable-next-line import/order
import { mockUser } from '#test/src/mocks/mockUser.js';

const mockGetUser = vi.fn().mockResolvedValue([mockUser, null]);

vi.mock('#src/services/user.js', () => ({
  getUser: mockGetUser,
}));

vi.mock('#src/components/Header/index.js', () => ({
  Header: () => html` <div>Header</div> `,
}));

vi.mock('#src/components/PostsList/index.js', () => ({
  PostsList: () => html` <div>PostsList</div> `,
}));

vi.mock('#src/components/Login/index.js', () => ({
  Login: () => html` <div>Login</div> `,
}));

vi.mock('#src/components/SignUp/index.js', () => ({
  SignUp: () => html` <div>SignUp</div> `,
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => html` <div>Navigate ${to}</div> `,
  Route: ({ element }: { element: Node }) => html` <div>${element}</div> `,
  Routes: ({ children }: { children: Node }) => html` <div>${children}</div> `,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError.js';
import { App } from '#src/components/App/index.js';
import { cleanup, fireEvent, render, screen, waitFor } from '#test/src/testUtils/index.js';

describe('App', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render posts list component', () => {
    render(html`<${App} />`);

    expect(screen.getByText('PostsList')).toBeInTheDocument();
  });

  describe('user is authenticated', () => {
    it('should not create login route', async () => {
      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
      });
    });

    it('should not create and sign-up route', async () => {
      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.queryByText('SignUp')).not.toBeInTheDocument();
      });
    });

    it('should create redirect for login and sign-up routes', async () => {
      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getAllByText('Navigate /')).toHaveLength(2);
      });
    });
  });

  describe('user is not authenticated', () => {
    it('should create login route', () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

      render(html`<${App} />`);

      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should not create and sign-up route', () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

      render(html`<${App} />`);

      expect(screen.getByText('SignUp')).toBeInTheDocument();
    });

    it('should not create redirect for login and sign-up routes', () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

      render(html`<${App} />`);

      expect(screen.queryByText('Navigate /')).not.toBeInTheDocument();
    });
  });

  describe('user authentication error', () => {
    it('should render snackbar with error', async () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)]);

      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText(ReasonPhrases.INTERNAL_SERVER_ERROR)).toBeInTheDocument();
      });
    });

    it('should hide alert when close button clicked', async () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)]);

      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText(ReasonPhrases.INTERNAL_SERVER_ERROR)).toBeInTheDocument();
      });

      const close = screen.getByTestId('CloseIcon');

      fireEvent.click(close);

      await waitFor(() => {
        expect(screen.queryByText(ReasonPhrases.INTERNAL_SERVER_ERROR)).not.toBeInTheDocument();
      });
    });
  });
});
