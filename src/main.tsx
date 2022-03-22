import { render } from 'preact';
import { RecoilRoot } from 'recoil';

import { App } from '@src/app';
import '@src/index.css';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
