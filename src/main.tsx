import { render } from 'preact';
import { App } from '@src/app';
import '@src/index.css';
import { RecoilRoot } from 'recoil';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
