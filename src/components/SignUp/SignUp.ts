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
import { useCallback, useReducer } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import { httpClient } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { promiser } from '@src/api/promiser';
import { User } from '@src/interfaces/model/User';
import { TargetedEvent } from '@src/interfaces/util/TargetedEvent';

import { Backdrop } from '../Backdrop';

interface SignUpPayload {
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
}
interface SignUpReducerState extends Partial<SignUpPayload> {
  loading?: boolean;
}

enum SignUpReducerActionType {
  SET_FIRST_NAME = 'setFirstName',
  SET_LAST_NAME = 'setLastName',
  SET_USERNAME = 'setUsername',
  SET_PASSWORD = 'setPassword',
  TOGGLE_LOADING = 'toggleLoading',
}

interface SignUpReducerAction {
  type: SignUpReducerActionType;
  payload?: string;
}

const reducer = (state: SignUpReducerState, action: SignUpReducerAction) => {
  switch (action.type) {
    case SignUpReducerActionType.SET_FIRST_NAME:
      return { ...state, firstName: action.payload };
    case SignUpReducerActionType.SET_LAST_NAME:
      return { ...state, lastName: action.payload };
    case SignUpReducerActionType.SET_USERNAME:
      return { ...state, username: action.payload };
    case SignUpReducerActionType.SET_PASSWORD:
      return { ...state, password: action.payload };
    case SignUpReducerActionType.TOGGLE_LOADING:
      return { ...state, loading: !state.loading };
    default:
      throw new Error();
  }
};

const initialState: SignUpReducerState = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  loading: false,
};

export const SignUp: FunctionComponent = () => {
  const [state, dispatch] = useReducer<SignUpReducerState, SignUpReducerAction>(
    reducer,
    initialState,
  );

  const { loading, username, password, firstName, lastName } = state;

  const navigate = useNavigate();

  const handleSignUp = useCallback(
    (payload: SignUpPayload) => async () => {
      dispatch({ type: SignUpReducerActionType.TOGGLE_LOADING });
      const [_, error] = await promiser(httpClient.post<User>('/api/v1/users', payload));

      if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
        console.error(error);
      } else if (error) {
        throw error;
      }

      dispatch({ type: SignUpReducerActionType.TOGGLE_LOADING });

      navigate('/login');
    },
    [navigate],
  );

  const handleSubmit = (e: TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && password) handleSignUp({ username, password, firstName, lastName });
  };

  const handleFirstNameChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: SignUpReducerActionType.SET_FIRST_NAME, payload: event.target.value });
  };

  const handleLastNameChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: SignUpReducerActionType.SET_LAST_NAME, payload: event.target.value });
  };

  const handleUsernameChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: SignUpReducerActionType.SET_USERNAME, payload: event.target.value });
  };

  const handlePasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
    dispatch({ type: SignUpReducerActionType.SET_PASSWORD, payload: event.target.value });
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
        <${Typography} sx=${{ mb: 4 }} variant="h4">Sign Up<//>
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
                label="First Name"
                inputProps=${{
                  autoComplete: 'off',
                }}
                name="firstName"
                value=${firstName}
                onChange=${handleFirstNameChange}
              />
            <//>
            <${Grid} item xs=${12}>
              <${TextField}
                label="Last Name"
                inputProps=${{
                  autoComplete: 'off',
                }}
                name="lastName"
                value=${lastName}
                onChange=${handleLastNameChange}
              />
            <//>
            <${Grid} item xs=${12}>
              <${TextField}
                label="Username"
                inputProps=${{
                  autoComplete: 'off',
                }}
                required
                name="username"
                value=${username}
                onChange=${handleUsernameChange}
              />
            <//>
            <${Grid} item xs=${12}>
              <${TextField}
                label="Password"
                inputProps=${{
                  autoComplete: 'off',
                }}
                required
                name="password"
                type="password"
                value=${password}
                onChange=${handlePasswordChange}
              />
            <//>
            <${Grid}item xs=${12}>
              <${Button} type="submit" fullWidth> SignUp <//>
            <//>
          <//>
        </form>
      <//>
    <//>
  `;
};
