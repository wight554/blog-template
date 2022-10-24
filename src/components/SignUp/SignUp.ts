import { useMutation } from '@tanstack/react-query';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { httpClient } from '#src/api/httpClient.js';
import { HttpError } from '#src/api/httpError.js';
import { AuthFormContainer } from '#src/components/AuthFormContainer/index.js';
import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { User } from '#src/interfaces/model/User.js';
import { SignUpPayload } from '#src/interfaces/payload/SignUpPayload.js';
import { UserRoutes } from '#src/services/user.js';
import { snackbarState } from '#src/store/snackbarState.js';
import { alphanumeric, composeValidators, mustMatch, required } from '#src/utils/validators.js';

interface SignUpFormData extends SignUpPayload {
  'confirm-password': string;
}

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleSetSnackBar = useRecoilCallback(
    ({ set }) =>
      (error: HttpError) => {
        return set(snackbarState, { open: true, message: error.message });
      },
    [],
  );

  const signUpMutation = useMutation(
    (payload: SignUpFormData) => {
      const { 'confirm-password': _, ...user } = payload;
      return httpClient.post<User>(UserRoutes.SIGN_UP, user);
    },
    {
      onSuccess: async (response) => {
        if (response.data) {
          navigate('/login');
        }
      },
      onError: (error) => {
        if (error instanceof HttpError) {
          handleSetSnackBar(error);
        }
      },
    },
  );

  const handleSubmit = useCallback(
    async (payload: SignUpFormData) => {
      signUpMutation.mutate(payload);
    },
    [signUpMutation],
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
