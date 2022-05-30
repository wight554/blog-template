import { Alert, CircularProgress, Grid, Snackbar } from '@mui/material';
import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';
import { useEffect } from 'preact/hooks';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import { HttpError } from '#src/api/httpError.js';
import { Backdrop } from '#src/components/Backdrop/index.js';
import { Header } from '#src/components/Header/index.js';
import { Login } from '#src/components/Login/index.js';
import { PostsList } from '#src/components/PostsList/index.js';
import { SignUp } from '#src/components/SignUp/index.js';
import { snackbarState } from '#src/store/snackbarState.js';
import { userInfoState } from '#src/store/userState.js';

import * as S from './styles.js';

export const App = () => {
  const userLoadable = useRecoilValueLoadable(userInfoState);
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);

  const user = userLoadable.state === 'hasValue' ? userLoadable.contents : null;
  const error = userLoadable.state === 'hasError' ? userLoadable.contents : null;

  useEffect(() => {
    if (error && error instanceof HttpError && error.code !== StatusCodes.UNAUTHORIZED) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  }, [setSnackbar, error]);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false });
  };

  return html`
    <${S.App}>
      <${Backdrop} open=${userLoadable.state === 'loading'}>
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
          <${Routes}>
            <${Route} path="/" element=${html` <${PostsList} />`} />
            <${Route}
              path="/login"
              element=${user ? html` <${Navigate} to="/" replace />` : html` <${Login} />`}
            />
            <${Route}
              path="/sign-up"
              element=${user ? html` <${Navigate} to="/" replace />` : html` <${SignUp} />`}
            />
          <//>
        <//>
      <//>
    <//>
  `;
};
