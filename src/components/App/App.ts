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
  const { state: getUserState, contents: user } = useRecoilValueLoadable(userInfoState);
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);

  const isGetUserSuccess = !!(getUserState === 'hasValue' && user);
  const isGetUserLoading = getUserState === 'loading';
  const getUserError = getUserState === 'hasError' ? user : null;

  useEffect(() => {
    if (
      getUserError &&
      getUserError instanceof HttpError &&
      getUserError.code !== StatusCodes.UNAUTHORIZED
    ) {
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
          <${Routes}>
            <${Route} path="/" element=${html` <${PostsList} />`} />
            <${Route}
              path="/login"
              element=${isGetUserSuccess
                ? html` <${Navigate} to="/" replace />`
                : html` <${Login} />`}
            />
            <${Route}
              path="/sign-up"
              element=${isGetUserSuccess
                ? html` <${Navigate} to="/" replace />`
                : html` <${SignUp} />`}
            />
          <//>
        <//>
      <//>
    <//>
  `;
};
