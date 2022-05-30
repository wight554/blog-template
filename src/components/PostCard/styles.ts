import { styled } from '@mui/material';

export const PostCard = styled('div')`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr auto;
  grid-gap: 16px;
`;

export const PostAuthor = styled('div')`
  display: inline-grid;
  grid-template-columns: min-content min-content;
  grid-gap: 8px;
`;
