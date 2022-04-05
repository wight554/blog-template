import { RenderOptions, RenderResult, render } from '@testing-library/preact';
import { html } from 'htm/preact';
import { ComponentChild, FunctionComponent } from 'preact';
import { RecoilRoot } from 'recoil';

const Providers: FunctionComponent = ({ children }) => html`<${RecoilRoot}>${children}<//>`;

export const renderWithProviders = (
  ui: ComponentChild,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) => html`<${Providers}>${children}<//>`;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};
