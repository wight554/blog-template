const mockGetUser = vi.fn().mockResolvedValue([{ id: '1', username: 'Username 1' }, null]);

vi.mock('#src/services/user.js', () => ({
  getUser: mockGetUser,
}));

vi.mock('#src/components/Header/index.js', () => ({
  Header: () => html` <div></div> `,
}));

vi.mock('#src/components/PostsList/index.js', () => ({
  PostsList: () => html` <div></div> `,
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
