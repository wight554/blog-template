import { httpClient } from '@src/api/httpClient';

const url = 'url';
const body = { data: 'data' };
const init = { headers: { Authorization: 'Bearer token' } };
const response = 'response';

global.fetch = vi.fn().mockImplementation(() => ({ json: vi.fn().mockResolvedValue(response) }));

describe('httpClient', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('delete', () => {
    it('should make delete request with given init', async () => {
      await httpClient.delete(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        method: 'DELETE',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.get(url, init)).toEqual({ data: response });
    });
  });

  describe('get', () => {
    it('should make get request with given init', async () => {
      await httpClient.get(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        method: 'GET',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.get(url, init)).toEqual({ data: response });
    });
  });

  describe('head', () => {
    it('should make head request with given init', async () => {
      await httpClient.head(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        method: 'HEAD',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.head(url, init)).toEqual({ data: response });
    });
  });

  describe('options', () => {
    it('should make options request with given init', async () => {
      await httpClient.options(url, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        method: 'OPTIONS',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.options(url, init)).toEqual({ data: response });
    });
  });

  describe('patch', () => {
    it('should make patch request with given body and init', async () => {
      await httpClient.patch(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        body: JSON.stringify(body),
        method: 'PATCH',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.patch(url, body, init)).toEqual({ data: response });
    });
  });

  describe('post', () => {
    it('should make post request with given body and init', async () => {
      await httpClient.post(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        body: JSON.stringify(body),
        method: 'PATCH',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.post(url, body, init)).toEqual({ data: response });
    });
  });

  describe('put', () => {
    it('should make put request with given body and init', async () => {
      await httpClient.put(url, body, init);

      expect(fetch).toHaveBeenCalledWith(url, {
        ...init,
        body: JSON.stringify(body),
        method: 'PATCH',
      });
    });

    it('should return response from fetch api', async () => {
      expect(await httpClient.put(url, body, init)).toEqual({ data: response });
    });
  });
});
