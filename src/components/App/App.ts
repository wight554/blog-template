import { Alert, CircularProgress, Grid, Snackbar } from '@mui/material';
import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';
import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { Outlet } from 'react-router-dom';

import { HttpError } from '#src/api/httpError.js';
import { snackbarAtom } from '#src/atoms/snackbar.js';
import { Backdrop } from '#src/components/Backdrop/index.js';
import { Header } from '#src/components/Header/index.js';
import { useUser } from '#src/services/user.js';

import * as S from './styles.js';

export const App = () => {
  const { error: getUserError, isLoading: isGetUserLoading } = useUser();

  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  useEffect(() => {
    if (getUserError instanceof HttpError && getUserError.code !== StatusCodes.UNAUTHORIZED) {
      setSnackbar({ open: true, message: getUserError.message, severity: 'error' });
    }
  }, [setSnackbar, getUserError]);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false });
  };

  return html`
    <${S.App}>
      <${Backdrop} open=${isGetUserLoading}>
        <${CircularProgress} color="inherit" />
      <//>
      <${Snackbar} open=${snackbar.open} autoHideDuration=${3000} onClose=${handleSnackbarClose}>
        <${Alert}
          onClose=${handleSnackbarClose}
          severity=${snackbar.severity || 'info'}
          sx=${{ display: !snackbar.open && 'none' }}
        >
          ${snackbar.message}
        <//>
      <//>
      <${Header} />
      <${Grid} container justifyContent="center" component=${S.MainContent}>
        <${S.PageWrapper}>
          <${Outlet} />
        <//>
      <//>
    <//>
  `;
};
