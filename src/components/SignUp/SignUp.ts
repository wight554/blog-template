import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { AuthFormContainer } from '@src/components/AuthFormContainer/index.js';
import { AuthFormField } from '@src/components/AuthFormField/index.js';
import { SignUpPayload } from '@src/interfaces/payload/SignUpPayload.js';
import { signUpUser } from '@src/services/user.js';
import { snackbarState } from '@src/store/snackbarState.js';
import { alphanumeric, composeValidators, mustMatch, required } from '@src/utils/validators.js';

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleSubmit = useRecoilCallback(
    ({ set }) =>
      async (payload: SignUpPayload) => {
        const [data, error] = await signUpUser(payload);

        if (data) {
          navigate('/login');
        }

        if (error) {
          set(snackbarState, { open: true, message: error.message });
        }
      },
    [],
  );

  return html`
    <${AuthFormContainer} onSubmit=${handleSubmit} title="Sign Up">
      <${AuthFormField}
        name="firstName"
        label="First Name"
        inputProps=${{
          autoComplete: 'off',
        }}
      />
      <${AuthFormField}
        name="lastName"
        label="Last Name"
        inputProps=${{
          autoComplete: 'off',
        }}
      />
      <${AuthFormField}
        required
        name="username"
        validate=${composeValidators(required, alphanumeric)}
        label="Username"
        inputProps=${{
          autoComplete: 'new-username',
        }}
      />
      <${AuthFormField}
        required
        name="password"
        type="password"
        validate=${required}
        label="Password"
        inputProps=${{
          autoComplete: 'new-password',
        }}
      />
      <${AuthFormField}
        required
        name="confirm-password"
        type="password"
        validate=${composeValidators(required, mustMatch('password'))}
        label="Confirm Password"
        inputProps=${{
          autoComplete: 'new-confirm-password',
        }}
      />
    <//>
  `;
};
