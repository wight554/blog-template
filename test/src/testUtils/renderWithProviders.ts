import { render, RenderOptions, RenderResult } from '@testing-library/preact';
import { html } from 'htm/preact';
import { ComponentChild, FunctionComponent } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

type ProviderOptions = Omit<RenderOptions, 'queries'>;

const Providers: FunctionComponent = ({ children }) => html`
  <${RecoilRoot}>
    <${BrowserRouter}>${children}<//>
  <//>
`;

export const renderWithProviders = (
  ui: ComponentChild,
  options: ProviderOptions = {},
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) => html`<${Providers}>${children}<//>`;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};
