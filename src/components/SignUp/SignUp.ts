import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { SignUpPayload } from '@src/interfaces/payload/SignUpPayload';
import { signUpUser } from '@src/services/user';
import { snackbarState } from '@src/store/snackbarState';
import { alphanumeric, composeValidators, mustMatch, required } from '@src/utils/validators';

import { AuthFormContainer } from '../AuthFormContainer';
import { AuthFormField } from '../AuthFormField';

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleSubmit = useRecoilCallback(
    ({ set }) =>
      async (payload: SignUpPayload) => {
        const [_, error] = await signUpUser(payload);

        if (error) set(snackbarState, { open: true, message: error.message });

        navigate('/login');
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
