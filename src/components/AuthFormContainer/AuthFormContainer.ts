import { Avatar, Grid, Button } from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { Form, FormRenderProps } from 'react-final-form';

import * as S from './styles';

interface AuthFormContainerProps {
  title: string;
  onSubmit: (values: Array<unknown>) => void;
}

export const AuthFormContainer: FunctionComponent<AuthFormContainerProps> = ({
  children,
  title,
  onSubmit,
}) => {
  return html`
    <${Form}
      onSubmit=${onSubmit}
      render=${({ handleSubmit, submitting, invalid }: FormRenderProps) => {
        return html`
          <${S.AuthFormContainer} container direction="column" alignItems="center">
            <${S.Paper}>
              <${S.AvatarContainer} container justifyContent="center">
                <${Avatar} />
              <//>
              <${S.AuthTitle} variant="h4" align="center">${title}<//>
              <form onSubmit=${handleSubmit}>
                <${Grid}
                  container
                  spacing=${3}
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  ${children}
                  <${S.ButtonContainer} item xs=${12}>
                    <${Button}
                      type="submit"
                      fullWidth
                      disabled=${submitting || invalid}
                      aria-busy=${submitting}
                      aria-describedby="auth-form-loading-progress"
                    >
                      Submit
                    <//>
                    ${submitting &&
                    html`
                      <${S.ButtonCircularProgress} id="auth-form-loading-progress" size=${24} />
                    `}
                  <//>
                <//>
              </form>
            <//>
          <//>
        `;
      }}
    <//>`;
};
