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
import { StatusCodes } from 'http-status-codes';
import { FunctionComponent } from 'preact';
import { useReducer } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { httpClient } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { promiser } from '@src/api/promiser';
import { User } from '@src/interfaces/model/User';
import { TargetedEvent } from '@src/interfaces/util/TargetedEvent';

import { Backdrop } from '../Backdrop';

interface LoginReducerState {
  username?: string;
  password?: string;
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
    () => async (payload) => {
      dispatch({ type: LoginReducerActionType.TOGGLE_LOADING });

      const [_, error] = await promiser(httpClient.post<User>('/api/v1/auth/login', payload));

      if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
        console.error(error);
      } else if (error) {
        throw error;
      }

      dispatch({ type: LoginReducerActionType.TOGGLE_LOADING });

      navigate('/');
    },
    [],
  );

  const handleSubmit = (e: TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleLogin({ username, password });
  };

  const handleUsernameChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: LoginReducerActionType.SET_USERNAME, payload: event.target.value });
  };

  const handlePasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: LoginReducerActionType.SET_PASSWORD, payload: event.target.value });
  };

  return html`
    <${Grid} container direction="column" alignItems="center" sx=${{ my: 10 }}>
      <${Backdrop} open=${loading}>
        <${CircularProgress} color="inherit" />
      <//>
      <${Paper} sx=${{ px: 5, py: 4 }}>
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
