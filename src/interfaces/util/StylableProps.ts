import { Theme } from '@mui/material';
import { MUIStyledCommonProps } from '@mui/system';

export type StylableProps<P> = P & Readonly<Required<MUIStyledCommonProps<Theme>>>;
