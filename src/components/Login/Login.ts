import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { AuthFormContainer } from '@src/components/AuthFormContainer/index.js';
import { AuthFormField } from '@src/components/AuthFormField/index.js';
import { LoginPayload } from '@src/interfaces/payload/LoginPayload.js';
import { loginUser } from '@src/services/user.js';
import { snackbarState } from '@src/store/snackbarState.js';
import { userInfoState } from '@src/store/userState.js';
import { alphanumeric, composeValidators, required } from '@src/utils/validators.js';

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleSubmit = useRecoilCallback(
    ({ set }) =>
      async (payload: LoginPayload) => {
        const [user, error] = await loginUser(payload);

        if (user) {
          set(userInfoState, user);
          navigate('/');
        }

        if (error) {
          set(snackbarState, { open: true, message: error.message });
        }
      },
    [],
  );

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
