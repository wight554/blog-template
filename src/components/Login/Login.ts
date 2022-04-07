import { Paper, Grid, TextField, Button, Typography, Avatar } from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import { TargetedEvent } from '@src/interfaces/util/TargetedEvent';

import { LoginPayload } from '../App/App';

interface LoginProps {
  onLogin: (payload: LoginPayload) => void;
}

export const Login: FunctionComponent<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

    onLogin({ username, password });
  };

  const handleUsernameChange = (event: TargetedEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return html`
    <${Grid} container direction="column" alignItems="center" sx=${{ my: 10 }}>
      <${Paper} sx=${{ px: 5, py: 4 }}>
        <${Grid} container justifyContent="center" sx=${{ mb: 2 }}>
          <${Avatar}><//>
        <//>
        <${Typography} sx=${{ mb: 4 }} variant="h4">Sign In<//>
        <form onSubmit=${handleLogin}>
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
                onChange=${handleUsernameChange}
              ><//>
            <//>
            <${Grid} item xs=${12}>
              <${TextField}
                label="Password"
                inputProps=${{
                  autoComplete: 'off',
                }}
                type=${'password'}
                onChange=${handlePasswordChange}
              ><//>
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
