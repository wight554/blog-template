import { render } from 'preact';
import { App } from '@src/app';
import '@src/index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById('app')!);
