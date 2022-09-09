import { Grid } from '@mui/material';
import { html } from 'htm/preact';
import { useRecoilValueLoadable } from 'recoil';

import { PostCard } from '#src/components/PostCard/index.js';
import { Post } from '#src/interfaces/model/Post.js';
import { postsState } from '#src/store/postState.js';

import * as S from './styles.js';

export const PostsList = () => {
  const { state: getPostsState, contents: posts = [] } = useRecoilValueLoadable(postsState);

  const isGetPostsSuccess = getPostsState === 'hasValue' && posts;

  return html`
    <${S.PostsList} square elevation=${24}>
      <${Grid} container spacing=${2} justifyContent="center">
        ${isGetPostsSuccess &&
        posts.map(
          (post: Post) =>
            html` <${Grid} item xs=${12}>
              <${PostCard} ...${post} />
            <//>`,
        )}
      <//>
    <//>
  `;
};
