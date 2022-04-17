import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { loginUser } from '@src/api/user';
import { LoginPayload } from '@src/interfaces/payload/LoginPayload';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';
import { alphanumeric, composeValidators, required } from '@src/utils/validators';

import { AuthFormContainer } from '../AuthFormContainer';
import { AuthFormField } from '../AuthFormField';

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleLogin = useRecoilCallback(
    ({ set }) =>
      async (payload: LoginPayload) => {
        const [user, error] = await loginUser(payload);

        if (user) set(userInfoState, user);

        if (error) set(snackbarState, { open: true, message: error.message });

        navigate('/');
      },
    [],
  );

  const handleSubmit = async (values: LoginPayload) => {
    await handleLogin(values);
  };

  return html`
    <${AuthFormContainer} onSubmit=${handleSubmit} title="Sign In">
      <${AuthFormField}
        name="username"
        validate=${composeValidators(required, alphanumeric)}
        label="Username"
        required
        inputProps=${{
          autoComplete: 'new-username',
        }}
      />
      <${AuthFormField}
        name="password"
        type="password"
        validate=${required}
        label="Password"
        required
        inputProps=${{
          autoComplete: 'new-password',
        }}
      />
    <//>
  `;
};
