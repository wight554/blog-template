import {
  Grid as MuiGrid,
  GridProps as MuiGridProps,
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled,
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material';

import { StylableProps } from '@src/interfaces/util/StylableProps';

import { Backdrop as AppBackdrop } from '../Backdrop';

export const AuthFormContainer = styled(MuiGrid)`
  margin: ${({ theme }: StylableProps<MuiGridProps>) => theme.spacing(10, 0)};
`;

export const Paper = styled(MuiPaper)`
  padding: ${({ theme }: StylableProps<MuiPaperProps>) => theme.spacing(4, 5)};
  position: relative;
`;

export const AvatarContainer = styled(MuiGrid)`
  margin-bottom: ${({ theme }: StylableProps<MuiGridProps>) => theme.spacing(2)};
`;

export const Backdrop = styled(AppBackdrop)`
  position: absolute;
`;

export const AuthTitle = styled(MuiTypography)`
  margin-bottom: ${({ theme }: StylableProps<MuiTypographyProps>) => theme.spacing(4)};
`;
