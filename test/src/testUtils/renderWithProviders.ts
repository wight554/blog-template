import { RenderOptions, RenderResult, render } from '@testing-library/preact';
import { createBrowserHistory, MemoryHistory } from 'history';
import { html } from 'htm/preact';
import { ComponentChild, FunctionComponent } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

interface ProvidersProps {
  history?: MemoryHistory;
}

type ProviderOptions = Omit<RenderOptions, 'queries'> & ProvidersProps;

const Providers: FunctionComponent<ProvidersProps> = ({
  children,
  history = createBrowserHistory(),
}) => html`
  <${RecoilRoot}>
    <${BrowserRouter} history=${history}> ${children} <//>
  <//>
`;

export const renderWithProviders = (
  ui: ComponentChild,
  options: ProviderOptions = {},
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) =>
    html`<${Providers} history=${options.history}>${children}<//>`;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};
