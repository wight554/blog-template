import { html } from 'htm/preact';

import { Header } from '@src/components/Header/index.js';
import { Logo } from '@src/components/Logo/index.js';

import * as S from './styles.js';

export const App = () => {
  return html`
    <${S.App}>
      <${Header} />
      <${S.MainContent}>
        <${S.HelloContainer}>
          <${Logo} />
          <p>Hello Vite + Preact!</p>
          <p>
            <a class="link" href="https://preactjs.com/" target="_blank" rel="noopener noreferrer">
              Learn Preact!
            </a>
          </p>
        <//>
      <//>
    <//>
  `;
};
