import { useMutation } from '@tanstack/react-query';
import { html } from 'htm/preact';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import { HttpError } from '#src/api/httpError.js';
import { snackbarAtom } from '#src/atoms/snackbar.js';
import { AuthFormContainer } from '#src/components/AuthFormContainer/index.js';
import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { SignUpPayload } from '#src/interfaces/payload/SignUpPayload.js';
import { signUpUser } from '#src/services/user.js';
import { alphanumeric, composeValidators, mustMatch, required } from '#src/utils/validators.js';

interface SignUpFormData extends SignUpPayload {
  'confirm-password': string;
}

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();
  const [, setSnackbar] = useAtom(snackbarAtom);

  const signUpMutation = useMutation(signUpUser, {
    onSuccess: async (response) => {
      if (response.data) {
        navigate('/login');
      }
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    },
  });

  const handleSubmit = useCallback(
    async (payload: SignUpFormData) => {
      const { 'confirm-password': _, ...user } = payload;

      try {
        await signUpMutation.mutateAsync(user);
      } catch {}
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
