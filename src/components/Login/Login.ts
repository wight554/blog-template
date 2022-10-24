import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { LoginPayload } from '#src/interfaces/payload/LoginPayload.js';
import { UserRoutes } from '#src/services/user.js';
import { snackbarState } from '#src/store/snackbarState.js';
import { alphanumeric, composeValidators, required } from '#src/utils/validators.js';

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSetSnackBar = useRecoilCallback(
    ({ set }) =>
      (error: HttpError) => {
        return set(snackbarState, { open: true, message: error.message });
      },
    [],
  );

  const loginMutation = useMutation(
    (payload: LoginPayload) => {
      return httpClient.post<User>(UserRoutes.LOGIN, payload);
    },
    {
      onSuccess: async (response) => {
        if (response.data) {
          queryClient.setQueryData<User>(['user'], response?.data);
          navigate('/');
        }
      },
      onError: (error) => {
        if (error instanceof HttpError) {
          handleSetSnackBar(error);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  const handleSubmit = useCallback(
    async (payload: LoginPayload) => {
      loginMutation.mutate(payload);
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
