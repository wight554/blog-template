import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';

import { AuthFormContainer } from '#src/components/AuthFormContainer/index.js';
import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { SignUpPayload } from '#src/interfaces/payload/SignUpPayload.js';
import { signUpUser, UserRoutes } from '#src/services/user.js';
import { alphanumeric, composeValidators, mustMatch, required } from '#src/utils/validators.js';

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const handleSubmit = useCallback(
    async (payload: SignUpPayload) => {
      await mutate(
        UserRoutes.GET,
        async () => {
          const [user, error] = await signUpUser(payload);

          if (error) throw error;

          return user;
        },
        { revalidate: false },
      );

      navigate('/login');
    },
    [mutate, navigate],
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
