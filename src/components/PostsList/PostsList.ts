import { Grid } from '@mui/material';
import { html } from 'htm/preact';
import { useRecoilValueLoadable } from 'recoil';

import { PostCard } from '@src/components/PostCard';
import { postsState } from '@src/store/postState';

import * as S from './styles';

export const PostsList = () => {
  const postsLoadable = useRecoilValueLoadable(postsState);
  const posts = postsLoadable.state === 'hasValue' ? postsLoadable.contents : [];

  return html`
    <${S.PostsList} square elevation=${24}>
      <${Grid} container spacing=${2} justifyContent="center">
        ${posts?.map(
          (post) =>
            html`<${Grid} item>
              <${PostCard} title=${post.title} author=${post.author} createdAt=${post.createdAt}
            /><//>`,
        )}
      <//>
    <//>
  `;
};
