import { Avatar, styled } from '@mui/material';

import { StylableProps } from '#src/interfaces/util/StylableProps.js';

export const PostCard = styled('div')`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr auto;
  grid-gap: ${({ theme }: StylableProps<Element>) => theme.spacing(2)};
`;

export const PostAuthor = styled('div')`
  display: inline-grid;
  grid-template-columns: min-content min-content;
  grid-gap: ${({ theme }: StylableProps<Element>) => theme.spacing(1)};
`;

export const AuthorAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
  font-size: 10px;
  display: inline-flex;
`;
