import { CircularProgress, Avatar, Grid, Button } from '@mui/material';
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
     render=${({ handleSubmit, submitting, invalid }: FormRenderProps) => html`
       <${S.AuthFormContainer} container direction="column" alignItems="center">
         <${S.Paper}>
           <${S.Backdrop} open=${submitting}>
             <${CircularProgress} color="inherit" />
           <//>
           <${S.AvatarContainer} container justifyContent="center">
             <${Avatar} />
           <//>
           <${S.AuthTitle} variant="h4">${title} <//>
           <form onSubmit=${handleSubmit}>
             <${Grid}
               container
               spacing=${3}
               direction="column"
               justify="center"
               alignItems="center"
             >
               ${children}
               <${Grid} item xs=${12}>
                 <${Button} type="submit" fullWidth disabled=${submitting || invalid}> Submit <//>
               <//>
             <//>
           </form>
         <//>
       <//>
     `}
    <//>`;
};
