const mockGetUser = vi.fn().mockResolvedValue([{ id: '1', username: 'Username 1' }, null]);

vi.mock('#src/services/user', () => ({
  getUser: mockGetUser,
}));

vi.mock('#src/components/Header', () => ({
  Header: () => html` <div></div> `,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createHttpError } from '#src/api/httpError.js';
import { App } from '#src/components/App/index.js';
import { render, screen, waitFor, fireEvent, cleanup } from '#test/src/testUtils/index.js';

describe('App', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('user is authenticated', () => {
    it('should render title based on username', async () => {
      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText('Hello Username 1!')).toBeInTheDocument();
      });
    });
  });

  describe('user is not authenticated', () => {
    it('should render title with generic username', async () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.UNAUTHORIZED)]);

      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText('Hello User!')).toBeInTheDocument();
      });
    });
  });

  describe('user authentication error', () => {
    it('should render title with generic username', async () => {
      mockGetUser.mockResolvedValueOnce([null, createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)]);

      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText('Hello User!')).toBeInTheDocument();
      });
    });

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
