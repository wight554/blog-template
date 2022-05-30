import { Avatar, Typography } from '@mui/material';
import { format } from 'date-fns';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';

import { User } from '#src/interfaces/model/User.js';

import * as S from './styles.js';

interface PostCardProps {
  title: string;
  createdAt: string;
  author: User;
}

export const PostCard: FunctionComponent<PostCardProps> = ({ title, author, createdAt }) => {
  return html`
    <${S.PostCard}>
      <div>
        <${S.PostAuthor}>
          <${Avatar} sx=${{ width: 20, height: 20, fontSize: '10px', display: 'inline-flex' }}>
            ${author.username.charAt(0).toUpperCase()}
          <//>
          <${Typography} variant="body2">${author.username} <//>
        <//>
        <${Typography} variant="h6"> ${title}<//>
        <${Typography} variant="body1"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.<//
        >
        <${Typography} variant="caption">${format(new Date(createdAt), 'E, d MMMM yyyy, HH:SS')}<//>
      </div>
      <img src="http://placehold.jp/320x180.png" alt="placeholder" />
    <//>
  `;
};
