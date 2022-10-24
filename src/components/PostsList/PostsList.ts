import { Grid } from '@mui/material';
import { html } from 'htm/preact';

import { PostCard } from '#src/components/PostCard/index.js';
import { Post } from '#src/interfaces/model/Post.js';
import { usePosts } from '#src/services/post.js';

import * as S from './styles.js';

export const PostsList = () => {
  const { isFetching: isGetPostsLoading, data: posts = [] } = usePosts();

  return html`
    <${S.PostsList} square elevation=${24}>
      <${Grid} container spacing=${2} justifyContent="center">
        ${(isGetPostsLoading ? Array.from(new Array(10)) : posts).map(
          (post: Post) =>
            html` <${Grid} item xs=${12}>
              <${PostCard} ...${post} loading=${isGetPostsLoading} />
            <//>`,
        )}
      <//>
    <//>
  `;
};
