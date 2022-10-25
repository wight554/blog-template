import { QueryClientProvider } from '@tanstack/react-query';
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

import { queryClient } from './queryClient.js';

type ProviderProps = {
  initialValues?: Iterable<readonly [Atom<unknown>, unknown]>;
};

type ProviderOptions = Omit<RenderOptions, 'queries'> & ProviderProps;

type ProviderHookOptions<Props> = RenderHookOptions<Props> & ProviderProps;

const Providers: FunctionComponent<ProviderProps> = ({ children, initialValues = [] }) =>
  html`
    <${JotaiProvider} initialValues=${initialValues}>
      <${QueryClientProvider} client=${queryClient}>
        <${BrowserRouter}>${children}<//>
      <//>
    <//>
  `;

export const renderWithProviders = (
  ui: ComponentChild,
  { initialValues, ...options }: ProviderOptions = {},
): RenderResult => {
  const Wrapper: FunctionComponent = ({ children }) =>
    html`<${Providers} initialValues=${initialValues}>${children}<//>`;

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export const renderHookWithProviders = <Result, Props>(
  render: (initialProps: Props) => Result,
  { initialValues, ...options }: ProviderHookOptions<Props> = {},
): RenderHookResult<Result, Props> => {
  const Wrapper: FunctionComponent = ({ children }) =>
    html`<${Providers} initialValues=${initialValues}>${children}<//>`;

  return renderHook<Result, Props>(render, {
    wrapper: Wrapper,
    ...options,
  });
};
