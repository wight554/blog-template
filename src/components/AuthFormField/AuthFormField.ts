import { Grid, TextFieldProps } from '@mui/material';
import { FieldValidator } from 'final-form';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';
import { Field, FieldRenderProps } from 'react-final-form';

import * as S from './styles.js';

interface FormFieldProps {
  validate: FieldValidator<string>;
}

type AuthFormFieldProps = TextFieldProps & FormFieldProps;

export const AuthFormField: FunctionComponent<AuthFormFieldProps> = ({
  name,
  type,
  validate,
  ...textFieldProps
}) => {
  return html`
    <${Field} name=${name} type=${type} validate=${validate}>
      ${({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => html`
        <${Grid} item xs=${12}>
          <${S.TextField}
            error=${meta.error && meta.touched}
            helperText=${meta.touched && meta.error}
            ...${input}
            ...${textFieldProps}
          />
        <//>
      `}
    <//>
  `;
};
