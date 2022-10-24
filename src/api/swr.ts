import useSWRDefault, { SWRHook } from 'swr';
import useSWRImmutableDefault from 'swr/immutable';

const useSWR = useSWRDefault as unknown as SWRHook;
const useSWRImmutable = useSWRImmutableDefault as unknown as SWRHook;

export { useSWR, useSWRImmutable };
export * from 'swr';
export * from 'swr/immutable';
