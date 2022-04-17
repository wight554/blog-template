import { Grid, Button } from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { signUpUser } from '@src/api/user';
import { SignUpPayload } from '@src/interfaces/payload/SignUpPayload';
import { snackbarState } from '@src/store/snackbarState';
import { alphanumeric, composeValidators, required } from '@src/utils/validators';

import { AuthFormContainer } from '../AuthFormContainer';
import { AuthTextField } from '../AuthTextField';

export const SignUp: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleSignUp = useRecoilCallback(
    ({ set }) =>
      async (payload: SignUpPayload) => {
        const [_, error] = await signUpUser(payload);

        if (error) set(snackbarState, { open: true, message: error.message });

        navigate('/login');
      },
    [],
  );

  const handleSubmit = async (values: SignUpPayload) => {
    await handleSignUp(values);
  };

  return html`
    <${Form}
      onSubmit=${handleSubmit}
      render=${({
        handleSubmit: handleFinalFormSubmit,
        submitting,
        invalid,
      }: FormRenderProps) => html`
        <${AuthFormContainer} loading=${submitting} title="Sign Up">
          <form onSubmit=${handleFinalFormSubmit}>
            <${Grid} container spacing=${3} direction="column" justify="center" alignItems="center">
              <${Field} name="firstName">
                ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
                  <${Grid} item xs=${12}>
                    <${AuthTextField}
                      ...${input}
                      error=${meta.error && meta.touched}
                      helperText=${meta.touched && meta.error}
                      label="First Name"
                      inputProps=${{
                        autoComplete: 'off',
                      }}
                    />
                  <//>
                `}
              <//>
              <${Field} name="lastName">
                ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
                  <${Grid} item xs=${12}>
                    <${AuthTextField}
                      ...${input}
                      error=${meta.error && meta.touched}
                      helperText=${meta.touched && meta.error}
                      label="Last Name"
                      inputProps=${{
                        autoComplete: 'off',
                      }}
                    />
                  <//>
                `}
              <//>
              <${Field} name="username" validate=${composeValidators(required, alphanumeric)}>
                ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
                  <${Grid} item xs=${12}>
                    <${AuthTextField}
                      ...${input}
                      error=${meta.error && meta.touched}
                      helperText=${meta.touched && meta.error}
                      required
                      label="Username"
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
                      required
                      label="Password"
                      inputProps=${{
                        autoComplete: 'new-password',
                      }}
                    />
                  <//>
                `}
              <//>
              <${Grid} item xs=${12}>
                <${Button} type="submit" fullWidth disabled=${submitting || invalid}> Submit <//>
              <//>
            <//>
          </form>
        <//>
      `}
    <//>
  `;
};
