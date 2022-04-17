import { CircularProgress, Avatar } from '@mui/material';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';

import * as S from './styles';

interface AuthFormContainerProps {
  title: string;
  loading: boolean;
}

export const AuthFormContainer: FunctionComponent<AuthFormContainerProps> = ({
  children,
  title,
  loading,
}) => {
  return html`
    <${S.AuthFormContainer} container direction="column" alignItems="center">
      <${S.Paper}>
        <${S.Backdrop} open=${loading}>
          <${CircularProgress} color="inherit" />
        <//>
        <${S.AvatarContainer} container justifyContent="center">
          <${Avatar} />
        <//>
        <${S.AuthTitle} variant="h4">${title}<//>
        ${children}
      <//>
    <//>
  `;
};
