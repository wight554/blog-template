import { Grid, Button } from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { loginUser } from '@src/api/user';
import { LoginPayload } from '@src/interfaces/payload/LoginPayload';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';
import { alphanumeric, composeValidators, required } from '@src/utils/validators';

import { AuthFormContainer } from '../AuthFormContainer';
import { AuthTextField } from '../AuthTextField';

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
    <${Form}
      onSubmit=${handleSubmit}
      render=${({
        handleSubmit: handleFinalFormSubmit,
        submitting,
        invalid,
      }: FormRenderProps) => html`
        <${AuthFormContainer} loading=${submitting} title="Sign In">
          <form onSubmit=${handleFinalFormSubmit}>
            <${Grid} container spacing=${3} direction="column" justify="center" alignItems="center">
              <${Field} name="username" validate=${composeValidators(required, alphanumeric)}>
                ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
                  <${Grid} item xs=${12}>
                    <${AuthTextField}
                      ...${input}
                      error=${meta.error && meta.touched}
                      helperText=${meta.touched && meta.error}
                      label="Username"
                      required
                      inputProps=${{
                        autoComplete: 'new-username',
                      }}
                    />
                  <//>
                `}
              <//>
              <${Field} name="password" type="password" validate=${required}>
                ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
                  <${Grid} item xs=${12}>
                    <${AuthTextField}
                      ...${input}
                      error=${meta.error && meta.touched}
                      helperText=${meta.touched && meta.error}
                      label="Password"
                      required
                      inputProps=${{
                        autoComplete: 'new-password',
                      }}
                    />
                  <//>
                `}
              <//>
              <${Grid} item xs=${12}>
                <${Button} type="submit" fullWidth disabled=${submitting || invalid}> Login <//>
              <//>
            <//>
          </form>
        <//>
      `}
    <//>
  `;
};
