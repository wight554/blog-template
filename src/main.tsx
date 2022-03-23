import 'preact/debug';
import { CssBaseline } from '@mui/material';
import { html } from 'htm/preact';
import { render } from 'preact';
import { RecoilRoot } from 'recoil';

import { App } from '@src/components/App/App';
import '@src/index.css';

render(
  html`
    <${RecoilRoot}>
      <${CssBaseline} />
      <${App} />
    </${RecoilRoot}>
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
