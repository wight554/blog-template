import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  RenderResult,
} from '@testing-library/preact';
import { html } from 'htm/preact';
import { Atom, Provider as JotaiProvider } from 'jotai';
import { ComponentChild, FunctionComponent } from 'preact';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

type ProviderProps = {
  jotaiInitialValues?: Iterable<readonly [Atom<unknown>, unknown]>;
};

type ProviderOptions = Omit<RenderOptions, 'queries'> & ProviderProps;

const Providers: FunctionComponent<ProviderProps> = ({ children, jotaiInitialValues = [] }) =>
  html`
    <${JotaiProvider} initialValues=${jotaiInitialValues}>
      <${QueryClientProvider} client=${queryClient}>
        <${BrowserRouter}>${children}<//>
      <//>
    <//>
  `;

export const renderWithProviders = (
  ui: ComponentChild,
  { jotaiInitialValues, ...options }: ProviderOptions = {},
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) =>
    html`<${Providers} jotaiInitialValues=${jotaiInitialValues}>${children}<//>`;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export const renderHookWithProviders = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
): RenderHookResult<Result, Props> => {
  const Wrapper: FunctionComponent = ({ children }) => html`<${Providers}>${children}<//>`;

  return renderHook<Result, Props>(render, {
    wrapper: Wrapper,
    ...options,
  });
};
