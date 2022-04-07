import { Backdrop as MuiBackdrop, BackdropProps as MuiBackdropProps, styled } from '@mui/material';

import { StylableProps } from '@src/interfaces/util/StylableProps';

export const App = styled('div')`
  height: 100%;
  text-align: center;
  background-color: #673ab8;
  color: #fff;
  font-size: 1.5em;
`;

export const Backdrop = styled(MuiBackdrop)`
  z-index: ${(props: StylableProps<MuiBackdropProps>) => props.theme.zIndex.drawer + 1};
  color: #fff;
`;

export const MainContent = styled('main')`
  display: flex;
  overflow: auto;
  flex-grow: 1;
  align-items: flex-start;
`;

export const HelloContainer = styled('div')`
  height: 100%;
  width: 100%;
`;
