import { HttpClient, httpClient, RequestMethod } from '#src/api/httpClient.js';
import { HttpError } from '#src/api/httpError.js';

const url = 'url';
const body = { data: 'data' };
const init = { headers: { Authorization: 'Bearer token' } };
const jsonResponse = '{"respose":"response"}';
const textResponse = 'response';

const mockResponse = {
  text: vi.fn().mockResolvedValue(jsonResponse),
  ok: true,
};

const mockFetch = vi.fn().mockImplementation(() => mockResponse);

global.fetch = mockFetch;

describe('httpClient', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('HttpClient', () => {
    describe('create', () => {
      it('should return http client function instance', async () => {
        expect(HttpClient.create()).toBeInstanceOf(Function);
      });
    });
  });

  describe('instance call', () => {
    describe('response is OK', () => {
      describe('response payload is valid JSON', () => {
        it('should return parsed response from fetch api', async () => {
          expect(await httpClient(url)).toEqual({
            data: JSON.parse(jsonResponse),
          });
        });
      });

      describe('response payload is not valid JSON', () => {
        it('should return string response from fetch api', async () => {
          vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

          expect(await httpClient(url)).toEqual({ data: textResponse });
        });
      });
    });

    describe('response is not OK', () => {
      it('should throw http error', async () => {
        mockFetch.mockReturnValueOnce({ ...mockResponse, ok: false });

        await expect(httpClient(url)).rejects.toThrowError(HttpError);
      });
    });

    describe('request method is DELETE', () => {
      it('should make fetch api DELETE request with empty body', async () => {
        await httpClient(url, RequestMethod.DELETE, init);

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: '{}',
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'DELETE',
        });
      });
    });

    describe('request method is GET', () => {
      it('should make fetch api GET request with undefined body', async () => {
        await httpClient(url, RequestMethod.GET, init);

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: undefined,
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'GET',
        });
      });
    });

    describe('request method is HEAD', () => {
      it('should make fetch api HEAD request with undefined body', async () => {
        await httpClient(url, RequestMethod.HEAD, init);

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: undefined,
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'HEAD',
        });
      });
    });

    describe('request method is OPTIONS', () => {
      it('should make fetch api OPTIONS request with empty body', async () => {
        await httpClient(url, RequestMethod.OPTIONS, init);

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: '{}',
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'OPTIONS',
        });
      });
    });

    describe('request method is PATCH', () => {
      it('should make fetch api PATCH request with given body', async () => {
        await httpClient(url, RequestMethod.PATCH, { ...init, body });

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: JSON.stringify(body),
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'PATCH',
        });
      });
    });

    describe('request method is POST', () => {
      it('should make fetch api POST request with given body', async () => {
        await httpClient(url, RequestMethod.POST, { ...init, body });

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: JSON.stringify(body),
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'POST',
        });
      });
    });

    describe('request method is PUT', () => {
      it('should make fetch api PUT request with given body', async () => {
        await httpClient(url, RequestMethod.PUT, { ...init, body });

        expect(fetch).toHaveBeenCalledWith(url, {
          ...init,
          body: JSON.stringify(body),
          headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
          method: 'PUT',
        });
      });
    });
  });

  describe('delete', () => {
    it('should return json response', async () => {
      expect(await httpClient.delete(url, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('get', () => {
    it('should return json response', async () => {
      expect(await httpClient.get(url, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('head', () => {
    it('should return json response', async () => {
      expect(await httpClient.head(url, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('options', () => {
    it('should return json response', async () => {
      expect(await httpClient.options(url, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('patch', () => {
    it('should return json response', async () => {
      expect(await httpClient.patch(url, body, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('post', () => {
    it('should return json response', async () => {
      expect(await httpClient.post(url, body, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });

  describe('put', () => {
    it('should return json response', async () => {
      expect(await httpClient.put(url, body, init)).toEqual({
        data: JSON.parse(jsonResponse),
      });
    });
  });
});
