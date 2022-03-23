interface HttpClientRequestInit<B> extends Omit<RequestInit, 'body'> {
  body?: B;
}

type HttpClientHeaders = Headers;

interface HttpClientResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpClientHeaders;
}

interface HttpClientInstance {
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

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}

const DEFAULT_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
});

const createHttpClientInstance = (): HttpClientInstance => {
  const makeRequest = async <T = unknown, B = unknown>(
    url: string,
    method: RequestMethod,
    init: HttpClientRequestInit<B> = {},
  ): Promise<HttpClientResponse<T>> => {
    const body = JSON.stringify(init.body);
    const headers = { ...DEFAULT_HEADERS, ...init.headers };

    const response = await fetch(url, { ...init, method, body, headers });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = await response.text();

    try {
      data = JSON.parse(data);
    } catch {}

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  };

  return {
    delete: <T = unknown, B = unknown>(
      url: string,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.DELETE, init);
    },
    get: <T = unknown, B = unknown>(
      url: string,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.GET, init);
    },
    head: <T = unknown, B = unknown>(
      url: string,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.HEAD, init);
    },
    options: <T = unknown, B = unknown>(
      url: string,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.OPTIONS, init);
    },
    patch: <T = unknown, B = unknown>(
      url: string,
      body?: B,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.PATCH, { ...init, body });
    },
    post: <T = unknown, B = unknown>(
      url: string,
      body?: B,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.POST, { ...init, body });
    },
    put: <T = unknown, B = unknown>(
      url: string,
      body?: B,
      init?: HttpClientRequestInit<B>,
    ): Promise<HttpClientResponse<T>> => {
      return makeRequest<T, B>(url, RequestMethod.PUT, { ...init, body });
    },
  };
};

export const httpClient = createHttpClientInstance();
