type PromiserFulfilled<T> = [T, null];

type PromiserRejected = [null, unknown];

type PromiserResult<T> = PromiserFulfilled<T> | PromiserRejected;

interface Promiser {
  <T = unknown>(value: Promise<Awaited<T>>): Promise<PromiserResult<T>>;
  all: <T = unknown>(values: Array<Awaited<T>>) => Promise<PromiserResult<Array<T>>>;
  allSettled: <T = unknown>(
    values: Array<Awaited<T>>,
  ) => Promise<PromiserResult<Array<PromiseSettledResult<Awaited<T>>>>>;
  any: <T = unknown>(values: Array<Awaited<T>>) => Promise<PromiserResult<T>>;
  race: <T = unknown>(values: Array<Awaited<T>>) => Promise<PromiserResult<T>>;
}

export function createPromiserInstance(): Promiser {
  const promiser = async <T = unknown>(
    promise: Promise<Awaited<T>>,
  ): Promise<PromiserResult<T>> => {
    return promise
      .then<PromiserResult<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);
  };

  promiser.all = async <T = unknown>(values: Array<Awaited<T>>) => {
    const promises: Promise<PromiserResult<Array<T>>> = Promise.all(values)
      .then<PromiserResult<Array<T>>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promises;
  };

  promiser.allSettled = async <T = unknown>(values: Array<Awaited<T>>) => {
    const promises: Promise<PromiserResult<Array<PromiseSettledResult<Awaited<T>>>>> =
      Promise.allSettled<T>(values)
        .then<PromiserResult<Array<PromiseSettledResult<Awaited<T>>>>>((data) => [data, null])
        .catch<PromiserRejected>((error) => [null, error]);

    return promises;
  };

  promiser.any = async <T = unknown>(values: Array<Awaited<T>>) => {
    const promise: Promise<PromiserResult<T>> = Promise.any<T>(values)
      .then<PromiserResult<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promise;
  };

  promiser.race = async <T = unknown>(values: Array<Awaited<T>>) => {
    const promise: Promise<PromiserResult<T>> = Promise.race(values)
      .then<PromiserResult<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promise;
  };

  return promiser;
}

export const promiser = createPromiserInstance();
