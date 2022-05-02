import 'preact/debug';
import { CssBaseline } from '@mui/material';
import { html } from 'htm/preact';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { App } from '@src/components/App/index.js';
import '@src/index.css';

render(
  html`
    <${RecoilRoot}>
      <${BrowserRouter}>
        <${CssBaseline} />
        <${App} />
      <//>
    <//>
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
