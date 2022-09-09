import { Typography } from '@mui/material';
import { format } from 'date-fns';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';

import { Post } from '#src/interfaces/model/Post.js';

import * as S from './styles.js';

type PostCardProps = Post;

const DATE_FORMAT = 'E, d MMMM yyyy, HH:SS';

export const PostCard: FunctionComponent<PostCardProps> = ({
  title,
  description,
  author,
  createdAt,
}) => {
  return html`
    <${S.PostCard}>
      <div>
        <${S.PostAuthor}>
          <${S.AuthorAvatar}> ${author.username.charAt(0).toUpperCase()} <//>
          <${Typography} variant="body2">${author.username} <//>
        <//>
        <${Typography} variant="h6">${title}<//>
        <${Typography} variant="body1">${description}<//>
        <${Typography} variant="caption">${format(new Date(createdAt), DATE_FORMAT)}<//>
      </div>
      <img src="http://placehold.jp/320x180.png" alt="placeholder" />
    <//>
  `;
};
