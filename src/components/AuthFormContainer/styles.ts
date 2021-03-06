import {
  CircularProgress as MuiCircularProgress,
  Grid as MuiGrid,
  GridProps as MuiGridProps,
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled,
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material';

import { StylableProps } from '#src/interfaces/util/StylableProps.js';

export const AuthFormContainer = styled(MuiGrid)`
  margin: ${({ theme }: StylableProps<MuiGridProps>) => theme.spacing(10, 0)};
`;

export const Paper = styled(MuiPaper)`
  padding: ${({ theme }: StylableProps<MuiPaperProps>) => theme.spacing(4)};
  position: relative;
`;

export const AvatarContainer = styled(MuiGrid)`
  margin-bottom: ${({ theme }: StylableProps<MuiGridProps>) => theme.spacing(2)};
`;

export const AuthTitle = styled(MuiTypography)`
  margin-bottom: ${({ theme }: StylableProps<MuiTypographyProps>) => theme.spacing(4)};
`;

export const ButtonContainer = styled(MuiGrid)`
  position: relative;
`;

export const ButtonCircularProgress = styled(MuiCircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
`;
