import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';

import { AuthFormContainer } from '#src/components/AuthFormContainer/index.js';
import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { LoginPayload } from '#src/interfaces/payload/LoginPayload.js';
import { loginUser, UserRoutes } from '#src/services/user.js';
import { alphanumeric, composeValidators, required } from '#src/utils/validators.js';

export const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const handleSubmit = useCallback(
    async (payload: LoginPayload) => {
      await mutate(
        UserRoutes.GET,
        async () => {
          const [user, error] = await loginUser(payload);

          if (error) throw error;

          return user;
        },
        { revalidate: false },
      );

      navigate('/');
    },
    [mutate, navigate],
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
