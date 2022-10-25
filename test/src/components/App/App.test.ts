vi.mock('#src/components/Header/index.js', () => ({
  Header: () => html` <div>Header</div> `,
}));

vi.mock('react-router-dom', () => ({
  Outlet: () => html` <div>Outlet</div> `,
}));

import { html } from 'htm/preact';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { App } from '#src/components/App/index.js';
import {
  cleanup,
  fireEvent,
  render,
  rest,
  screen,
  server,
  waitFor,
} from '#test/src/testUtils/index.js';

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
    beforeEach(() => {
      server.use(
        rest.get('*/api/v1/users', (_req, res, ctx) => {
          return res(
            ctx.status(StatusCodes.INTERNAL_SERVER_ERROR),
            ctx.json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR }),
          );
        }),
      );
    });

    it('should render snackbar with error', async () => {
      render(html`<${App} />`);

      await waitFor(() => {
        expect(screen.getByText(ReasonPhrases.INTERNAL_SERVER_ERROR)).toBeInTheDocument();
      });
    });

    it('should hide alert when close button clicked', async () => {
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
