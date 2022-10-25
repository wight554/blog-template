import { useMutation, useQueryClient } from '@tanstack/react-query';
import { html } from 'htm/preact';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import { HttpError } from '#src/api/httpError.js';
import { snackbarAtom } from '#src/atoms/snackbar.js';
import { AuthFormContainer } from '#src/components/AuthFormContainer/index.js';
import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { User } from '#src/interfaces/model/User.js';
import { LoginPayload } from '#src/interfaces/payload/LoginPayload.js';
import { loginUser } from '#src/services/user.js';
import { alphanumeric, composeValidators, required } from '#src/utils/validators.js';

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [, setSnackbar] = useAtom(snackbarAtom);

  const loginMutation = useMutation(loginUser, {
    onSuccess: async (response) => {
      if (response.data) {
        queryClient.setQueryData<User>(['user'], response?.data);
        queryClient.invalidateQueries(['user']);

        navigate('/');
      }
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    },
  });

  const handleSubmit = useCallback(
    async (payload: LoginPayload) => {
      try {
        await loginMutation.mutateAsync(payload);
      } catch {}
    },
    [loginMutation],
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
