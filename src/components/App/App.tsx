import { Logo } from '@src/components/Logo';
import { Header } from '@src/components/Header';

import * as S from './styles';

export const App = () => {
  return (
    <S.App>
      <Header />
      <S.MainContent>
        <Logo />
        <p>Hello Vite + Preact!</p>
        <p>
          <a class="link" href="https://preactjs.com/" target="_blank" rel="noopener noreferrer">
            Learn Preact!
          </a>
        </p>
      </S.MainContent>
    </S.App>
  );
};
