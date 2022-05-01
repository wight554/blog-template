import { getReasonPhrase } from 'http-status-codes';

export class HttpError extends Error {
  public code?: number;

  constructor(message?: string, code?: number, name = new.target.name) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.code = code;
  }
}

export const createHttpError = (code: number | string, message?: string) => {
  let name;
  let phrase;

  try {
    phrase = getReasonPhrase(code);
    const regex = /_|[^\w]+(\w)?/gi;

    const camelCasePhrase = phrase.replace(regex, (_match, letter) => {
      return letter.toUpperCase();
    });

    name = `${camelCasePhrase}Error`;
  } catch {}

  return new HttpError(message || phrase, Number(code), name);
};
