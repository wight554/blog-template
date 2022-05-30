import {
  Box as MuiBox,
  BoxProps as MuiBoxProps,
  CircularProgress as MuiCircularProgress,
  IconButton as MuiIconButton,
  Menu as MuiMenu,
  styled,
  Toolbar as MuiToolbar,
} from '@mui/material';

import { StylableProps } from '#src/interfaces/util/StylableProps.js';

export const Toolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
`;

export const AvatarWrapper = styled(MuiBox)`
  /* margin: ${({ theme }: StylableProps<MuiBoxProps>) => theme.spacing(1)}; */
  position: relative;
`;

export const AvatarButton = styled(MuiIconButton)`
  padding: 0;
`;

export const AvatarCircularProgress = styled(MuiCircularProgress)`
  position: absolute;
  top: -6px;
  left: -6px;
  z-index: 1;
`;

export const UserMenu = styled(MuiMenu)`
  margin-top: 45px;
`;
