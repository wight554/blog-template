type PromiserFulfilled<T> = [data: T, error: null];

type PromiserRejected = [data: null, error: unknown];

type PromiserResult<T> = PromiserFulfilled<T> | PromiserRejected;

export interface PromiserInstance {
  <T = unknown>(value: Promise<Awaited<T>>): Promise<PromiserResult<T>>;
  all: <T = unknown>(values: Array<Promise<Awaited<T>>>) => Promise<PromiserResult<Array<T>>>;
  allSettled: <T = unknown>(
    values: Array<Promise<Awaited<T>>>,
  ) => Promise<PromiserResult<Array<PromiseSettledResult<Awaited<T>>>>>;
  any: <T = unknown>(values: Array<Promise<Awaited<T>>>) => Promise<PromiserResult<T>>;
  race: <T = unknown>(values: Array<Promise<Awaited<T>>>) => Promise<PromiserResult<T>>;
}

export class Promiser {
  public async call<T = unknown>(promise: Promise<Awaited<T>>): Promise<PromiserResult<T>> {
    return promise
      .then<PromiserFulfilled<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);
  }

  public async all<T = unknown>(values: Array<Promise<Awaited<T>>>) {
    const promises: Promise<PromiserResult<Array<T>>> = Promise.all(values)
      .then<PromiserFulfilled<Array<T>>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promises;
  }

  public async allSettled<T = unknown>(values: Array<Promise<Awaited<T>>>) {
    const promises: Promise<PromiserResult<Array<PromiseSettledResult<Awaited<T>>>>> =
      Promise.allSettled<T>(values)
        .then<PromiserFulfilled<Array<PromiseSettledResult<Awaited<T>>>>>((data) => [data, null])
        .catch<PromiserRejected>((error) => [null, error]);

    return promises;
  }

  public async any<T = unknown>(values: Array<Promise<Awaited<T>>>) {
    const promise: Promise<PromiserResult<T>> = Promise.any<T>(values)
      .then<PromiserFulfilled<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promise;
  }

  public async race<T = unknown>(values: Array<Promise<Awaited<T>>>) {
    const promise: Promise<PromiserResult<T>> = Promise.race(values)
      .then<PromiserFulfilled<T>>((data) => [data, null])
      .catch<PromiserRejected>((error) => [null, error]);

    return promise;
  }

  public static create(): PromiserInstance {
    const instance = new Promiser();

    return Object.assign(async <T>(promise: Promise<Awaited<T>>) => instance.call<T>(promise), {
      all: async <T = unknown>(values: Array<Promise<Awaited<T>>>) => instance.all<T>(values),
      allSettled: async <T = unknown>(values: Array<Promise<Awaited<T>>>) =>
        instance.allSettled<T>(values),
      any: async <T = unknown>(values: Array<Promise<Awaited<T>>>) => instance.any<T>(values),
      race: async <T = unknown>(values: Array<Promise<Awaited<T>>>) => instance.race<T>(values),
    });
  }
}

export const promiser = Promiser.create();
