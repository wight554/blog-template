import { httpClient } from '@src/api/httpClient';

const url = 'url';
const body = { data: 'data' };
const init = { headers: { Authorization: 'Bearer token' } };
const jsonResponse = '{"respose":"response"}';
const textResponse = 'response';

const mockResponse = {
  text: vi.fn().mockResolvedValue(jsonResponse),
  ok: true,
};

global.fetch = vi.fn().mockImplementation(() => mockResponse);

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

  describe('delete', () => {
    it('should make delete request with given init', async () => {
      await httpClient.delete(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        body: '{}',
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        method: 'DELETE',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.delete(url, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.delete(url, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('get', () => {
    it('should make get request with given init', async () => {
      await httpClient.get(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        method: 'GET',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.get(url, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.get(url, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('head', () => {
    it('should make head request with given init', async () => {
      await httpClient.head(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        method: 'HEAD',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.head(url, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.head(url, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('options', () => {
    it('should make options request with given init', async () => {
      await httpClient.options(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        body: '{}',
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        method: 'OPTIONS',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.options(url, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.options(url, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('patch', () => {
    it('should make patch request with given body and init', async () => {
      await httpClient.patch(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
        method: 'PATCH',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.patch(url, body, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.patch(url, body, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('post', () => {
    it('should make post request with given body and init', async () => {
      await httpClient.post(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
        method: 'POST',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.post(url, body, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.post(url, body, init)).toEqual({ data: textResponse });
      });
    });
  });

  describe('put', () => {
    it('should make put request with given body and init', async () => {
      await httpClient.put(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
        method: 'PUT',
      });
    });

    describe('response payload is valid JSON', () => {
      it('should return parsed response from fetch api', async () => {
        expect(await httpClient.put(url, body, init)).toEqual({ data: JSON.parse(jsonResponse) });
      });
    });

    describe('response payload is not valid JSON', () => {
      it('should return string response from fetch api', async () => {
        vi.spyOn(mockResponse, 'text').mockResolvedValueOnce(textResponse);

        expect(await httpClient.put(url, body, init)).toEqual({ data: textResponse });
      });
    });
  });
});
