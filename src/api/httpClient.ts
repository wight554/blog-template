import { createHttpError } from '@src/api/httpError.js';

const DEFAULT_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
});

export interface HttpClientRequestInit<B> extends Omit<RequestInit, 'body'> {
  body?: B;
}

export type HttpClientHeaders = Headers;

export interface HttpClientResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpClientHeaders;
}

export interface HttpClientInstance {
  <T = unknown, B = unknown>(
    url: string,
    method?: RequestMethod,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  delete<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  get<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  head<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  options<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  patch<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  post<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
  put<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>>;
}

export enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}

export class HttpClient {
  public async call<T = unknown, B = unknown>(
    url: string,
    method: RequestMethod = RequestMethod.GET,
    init: HttpClientRequestInit<B> = {},
  ): Promise<HttpClientResponse<T>> {
    const headers = { ...DEFAULT_HEADERS, ...init.headers };

    let body;
    if (![RequestMethod.GET, RequestMethod.HEAD].includes(method)) {
      body = JSON.stringify(init.body || {});
    }

    const fetchResponse = await fetch(url, { ...init, method, body, headers });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = await fetchResponse.text();

    try {
      data = JSON.parse(data);
    } catch {}

    if (!fetchResponse.ok) {
      throw createHttpError(fetchResponse.status, data?.message);
    }

    const response = {
      data,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: fetchResponse.headers,
    };

    return response;
  }

  public async delete<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.DELETE, init);
  }

  public async get<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.GET, init);
  }

  public async head<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.HEAD, init);
  }

  public async options<T = unknown, B = unknown>(
    url: string,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.OPTIONS, init);
  }

  public async patch<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.PATCH, { ...init, body });
  }

  public async post<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.POST, { ...init, body });
  }

  public async put<T = unknown, B = unknown>(
    url: string,
    body?: B,
    init?: HttpClientRequestInit<B>,
  ): Promise<HttpClientResponse<T>> {
    return this.call<T, B>(url, RequestMethod.PUT, { ...init, body });
  }

  public static create(): HttpClientInstance {
    const instance = new HttpClient();

    return Object.assign(
      async <T = unknown, B = unknown>(
        url: string,
        method: RequestMethod = RequestMethod.GET,
        init: HttpClientRequestInit<B> = {},
      ) => instance.call<T, B>(url, method, init),
      {
        delete: async <T = unknown, B = unknown>(url: string, init?: HttpClientRequestInit<B>) =>
          instance.delete<T, B>(url, init),
        get: async <T = unknown, B = unknown>(url: string, init?: HttpClientRequestInit<B>) =>
          instance.get<T, B>(url, init),
        head: async <T = unknown, B = unknown>(url: string, init?: HttpClientRequestInit<B>) =>
          instance.head<T, B>(url, init),
        options: async <T = unknown, B = unknown>(url: string, init?: HttpClientRequestInit<B>) =>
          instance.options<T, B>(url, init),
        patch: async <T = unknown, B = unknown>(
          url: string,
          body?: B,
          init?: HttpClientRequestInit<B>,
        ) => instance.patch<T, B>(url, body, init),
        post: async <T = unknown, B = unknown>(
          url: string,
          body?: B,
          init?: HttpClientRequestInit<B>,
        ) => instance.post<T, B>(url, body, init),
        put: async <T = unknown, B = unknown>(
          url: string,
          body?: B,
          init?: HttpClientRequestInit<B>,
        ) => instance.put<T, B>(url, body, init),
      },
    );
  }
}

export const httpClient = HttpClient.create();
