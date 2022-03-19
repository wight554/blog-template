import 'preact/debug';
import { render } from 'preact';
import { html } from 'htm/preact';
import { CssBaseline } from '@mui/material';

import { App } from '@src/components/App/App';
import '@src/index.css';

render(
  html`
    <${CssBaseline} />
    <${App} />
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
