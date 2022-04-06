import { getReasonPhrase } from 'http-status-codes';

export class HttpError extends Error {
  public code?: number;

  constructor(message?: string, code?: number, name?: string) {
    super(message);

    this.name = name || 'HttpError';
    this.code = code;
  }
}

export const createHttpError = (code: number | string, message?: string) => {
  let name;
  let phrase;

  try {
    phrase = getReasonPhrase(code);
    const regex = /_|[^\w]+(\w)?/gi;

    const output = phrase.replace(regex, (_match, letter) => {
      return letter.toUpperCase();
    });

    name = `${output}Error`;
  } catch {}

  return new HttpError(message || phrase, Number(code), name);
};
