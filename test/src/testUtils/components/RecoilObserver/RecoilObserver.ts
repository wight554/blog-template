import { RenderableProps } from 'preact';
import preactHooks = require('preact/hooks');
import { RecoilValue, useRecoilValueLoadable } from 'recoil';

interface RecoilObserverProps<T> {
  async?: boolean;
  node: RecoilValue<T>;
  onChange: (value: unknown) => void;
}

export const RecoilObserver = <T>({
  node,
  onChange,
  async = false,
}: RenderableProps<RecoilObserverProps<T>>) => {
  const value = useRecoilValueLoadable(node);
  preactHooks.useEffect(() => onChange(async ? value : value.contents), [onChange, async, value]);
  return null;
};
