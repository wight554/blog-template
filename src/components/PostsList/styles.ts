import { Paper, PaperProps, styled } from '@mui/material';

import { StylableProps } from '#src/interfaces/util/StylableProps.js';

export const PostsList = styled(Paper)`
  width: 960px;
  padding: ${({ theme }: StylableProps<PaperProps>) => theme.spacing(4)};
`;
