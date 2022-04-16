import { Backdrop as MuiBackdrop, BackdropProps as MuiBackdropProps, styled } from '@mui/material';

import { StylableProps } from '@src/interfaces/util/StylableProps';

export const Backdrop = styled(MuiBackdrop)`
  z-index: ${(props: StylableProps<MuiBackdropProps>) => props.theme.zIndex.drawer + 1};
  color: #fff;
`;
