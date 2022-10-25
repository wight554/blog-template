import { mockUser } from '#test/src/mocks/index.js';

const mockUseUser = vi
  .fn()
  .mockReturnValue({ data: mockUser, error: undefined, isInitialLoading: false });

vi.mock('#src/services/user.js', () => ({
  useUser: mockUseUser,
}));

vi.mock('#src/components/Header/index.js', () => ({
  Header: () => html` <div>Header</div> `,
}));

vi.mock('react-router-dom', () => ({
  Outlet: () => html` <div>Outlet</div> `,
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

  it('should render router outlet', () => {
    render(html`<${App} />`);

    expect(screen.getByText('Outlet')).toBeInTheDocument();
  });

  describe('user authentication error', () => {
    it('should render snackbar with error', async () => {
      mockUseUser.mockReturnValueOnce({
        data: null,
        error: createHttpError(StatusCodes.INTERNAL_SERVER_ERROR),
        isInitialLoading: false,
      });

      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText(ReasonPhrases.INTERNAL_SERVER_ERROR)).toBeInTheDocument();
      });
    });

    it('should hide alert when close button clicked', async () => {
      mockUseUser.mockReturnValueOnce({
        error: createHttpError(StatusCodes.INTERNAL_SERVER_ERROR),
        isInitialLoading: false,
      });

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
