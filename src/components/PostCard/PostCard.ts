import { Skeleton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { html } from 'htm/preact';
import { FunctionComponent } from 'preact';

import { Post } from '#src/interfaces/model/Post.js';

import * as S from './styles.js';

type PostCardProps = Post & {
  loading: boolean;
};

const DATE_FORMAT = 'E, d MMMM yyyy, HH:SS';

export const PostCard: FunctionComponent<PostCardProps> = ({
  title,
  description,
  author,
  createdAt,
  loading,
}) => {
  return html`
    <${S.PostCard}>
      <main >
        <${S.PostAuthor}>
          ${
            loading
              ? html`
                  <${Skeleton} animation="wave" variant="circular" width=${20} height=${20} />
                  <${Skeleton} animation="wave" height=${20} width=${40} />
                `
              : html`
                  <${S.AuthorAvatar}> ${author.username.charAt(0).toUpperCase()} <//>
                  <${Typography} variant="body2">${author.username} <//>
                `
          }
        <//>
        ${
          loading
            ? html`
                <${Skeleton} animation="wave" height=${32} style=${{ marginBottom: 6 }} />
                <${Skeleton} animation="wave" height=${72} width="80%" />
                <${Skeleton} animation="wave" height=${14} width="40%" />
              `
            : html`
                <${Typography} variant="h6">${title}<//>
                <${Typography} variant="body1">${description}<//>
                <${Typography} variant="caption">${format(new Date(createdAt), DATE_FORMAT)}<//>
              `
        }
      </div>
      ${
        loading
          ? html`<${Skeleton} width=${320} height=${180} animation="wave" variant="rectangular" />`
          : html`<img src="http://placehold.jp/320x180.png" alt="placeholder" />`
      }
    <//>
  `;
};
