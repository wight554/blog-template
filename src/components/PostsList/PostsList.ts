import { Grid } from '@mui/material';
import { html } from 'htm/preact';
import { useRecoilValueLoadable } from 'recoil';

import { PostCard } from '#src/components/PostCard/index.js';
import { Post } from '#src/interfaces/model/Post.js';
import { postsState } from '#src/store/postState.js';

import * as S from './styles.js';

export const PostsList = () => {
  const { state: getPostsState, contents: posts } = useRecoilValueLoadable(postsState);

  const isGetPostsLoading = getPostsState === 'loading';

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
