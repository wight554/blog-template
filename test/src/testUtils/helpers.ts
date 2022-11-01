export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout);
  });
}

export const delay = async <T>(callback: T, timeout: number): Promise<T> => {
  await sleep(timeout);

  return callback;
};
