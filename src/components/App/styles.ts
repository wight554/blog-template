import { styled } from '@mui/material';

import { StylableProps } from '#src/interfaces/util/StylableProps.js';

export const App = styled('div')`
  height: 100%;
  font-size: 1.5em;
`;

export const MainContent = styled('main')`
  overflow: auto;
  flex-grow: 1;
  margin-top: ${({ theme }: StylableProps<Element>) => theme.spacing(8)};
`;

export const PageWrapper = styled('div')`
  max-width: 1280px;
`;

export const HelloContainer = styled('div')`
  height: 100%;
  width: 100%;
`;
