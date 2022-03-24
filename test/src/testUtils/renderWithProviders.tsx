import { RenderOptions, RenderResult, render } from '@testing-library/preact';
import { ComponentChild, FunctionComponent } from 'preact';
import { RecoilRoot } from 'recoil';

const Providers: FunctionComponent = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

export const renderWithProviders = (
  ui: ComponentChild,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) => <Providers>{children}</Providers>;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};
