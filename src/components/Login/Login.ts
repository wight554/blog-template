import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useReducer } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { loginUser } from '@src/api/user';
import { LoginPayload } from '@src/interfaces/payload/LoginPayload';
import { TargetedEvent } from '@src/interfaces/util/TargetedEvent';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';

import { Backdrop } from '../Backdrop';

interface LoginReducerState extends Partial<LoginPayload> {
  loading?: boolean;
}

enum LoginReducerActionType {
  SET_USERNAME = 'setUsername',
  SET_PASSWORD = 'setPassword',
  TOGGLE_LOADING = 'toggleLoading',
}

interface LoginReducerAction {
  type: LoginReducerActionType;
  payload?: string;
}

const reducer = (state: LoginReducerState, action: LoginReducerAction) => {
  switch (action.type) {
    case LoginReducerActionType.SET_USERNAME:
      return { ...state, username: action.payload };
    case LoginReducerActionType.SET_PASSWORD:
      return { ...state, password: action.payload };
    case LoginReducerActionType.TOGGLE_LOADING:
      return { ...state, loading: !state.loading };
    default:
      throw new Error();
  }
};

const initialState: LoginReducerState = {
  username: '',
  password: '',
  loading: false,
};

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer<LoginReducerState, LoginReducerAction>(
    reducer,
    initialState,
  );

  const { loading, username, password } = state;

  const handleLogin = useRecoilCallback(
    ({ set }) =>
      async (payload: LoginPayload) => {
        dispatch({ type: LoginReducerActionType.TOGGLE_LOADING });

        const [user, error] = await loginUser(payload);

        if (user) set(userInfoState, user);

        if (error) set(snackbarState, { open: true, message: error.message });

        navigate('/');
      },
    [],
  );

  const handleSubmit = (e: TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && password) handleLogin({ username, password });
  };

  const handleUsernameChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: LoginReducerActionType.SET_USERNAME, payload: event.target.value });
  };

  const handlePasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: LoginReducerActionType.SET_PASSWORD, payload: event.target.value });
  };

  return html`
    <${Grid} container direction="column" alignItems="center" sx=${{ my: 10 }}>
      <${Paper} sx=${{ px: 5, py: 4, position: 'relative' }}>
        <${Backdrop} open=${loading} sx=${{ position: 'absolute' }}>
          <${CircularProgress} color="inherit" />
        <//>
        <${Grid} container justifyContent="center" sx=${{ mb: 2 }}>
          <${Avatar} />
        <//>
        <${Typography} sx=${{ mb: 4 }} variant="h4">Sign In<//>
        <form onSubmit=${handleSubmit}>
          <${Grid}
            container
            spacing=${3}
            direction=${'column'}
            justify=${'center'}
            alignItems=${'center'}
          >
            <${Grid} item xs=${12}>
              <${TextField}
                label="Username"
                inputProps=${{
                  autoComplete: 'off',
                }}
                name="username"
                onChange=${handleUsernameChange}
                value=${username}
              />
            <//>
            <${Grid} item xs=${12}>
              <${TextField}
                label="Password"
                inputProps=${{
                  autoComplete: 'off',
                }}
                name="password"
                type="password"
                onChange=${handlePasswordChange}
                value=${password}
              />
            <//>
            <${Grid}item xs=${12}>
              <${Button} type="submit" fullWidth> Login <//>
            <//>
          <//>
        </form>
      <//>
    <//>
  `;
};
