import { Promiser, promiser } from '@src/api/promiser';

describe('promiser', () => {
  describe('Promiser', () => {
    describe('create', () => {
      it('should return promiser function instance', async () => {
        expect(Promiser.create()).toBeInstanceOf(Function);
      });
    });
  });

  describe('instance call', () => {
    describe('fulfilled result', () => {
      it('should return resolved response with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser(Promise.resolve(response));

        expect(data).toBe(response);
        expect(error).toBe(null);
      });
    });

    describe('rejected result', () => {
      it('should return null response with error', async () => {
        const response = 'response';

        const [data, error] = await promiser(Promise.reject(response));

        expect(data).toBe(null);
        expect(error).toBe(response);
      });
    });
  });

  describe('all', () => {
    describe('fulfilled result', () => {
      it('should return resolved responses array with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.all([Promise.resolve(response)]);

        expect(data).toStrictEqual([response]);
        expect(error).toBe(null);
      });
    });

    describe('rejected result', () => {
      it('should return null response with error', async () => {
        const response = 'response';

        const [data, error] = await promiser.all([Promise.reject(response)]);

        expect(data).toBe(null);
        expect(error).toBe(response);
      });
    });

    describe('mixed result', () => {
      it('should return null response with error', async () => {
        const response = 'response';

        const [data, error] = await promiser.all([
          Promise.resolve(response),
          Promise.reject(response),
        ]);

        expect(data).toBe(null);
        expect(error).toBe(response);
      });
    });
  });

  describe('allSettled', () => {
    describe('fulfilled result', () => {
      it('should return resolved responses array with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.allSettled([Promise.resolve(response)]);

        expect(data).toStrictEqual([{ status: 'fulfilled', value: response }]);
        expect(error).toBe(null);
      });
    });

    describe('rejected result', () => {
      it('should return rejected responses array with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.allSettled([Promise.reject(response)]);

        expect(data).toStrictEqual([{ reason: response, status: 'rejected' }]);
        expect(error).toBe(null);
      });
    });

    describe('mixed result', () => {
      it('should return rejected and fulfilled responses array with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.allSettled([
          Promise.resolve(response),
          Promise.reject(response),
        ]);

        expect(data).toStrictEqual([
          { status: 'fulfilled', value: response },
          { reason: response, status: 'rejected' },
        ]);
        expect(error).toBe(null);
      });
    });
  });

  describe('any', () => {
    describe('fulfilled result', () => {
      it('should return resolved response with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.any([Promise.resolve(response)]);

        expect(data).toBe(response);
        expect(error).toBe(null);
      });
    });

    describe('rejected result', () => {
      it('should return null response with aggregate error', async () => {
        const response = 'response';

        const [data, error] = await promiser.any([Promise.reject(response)]);

        expect(data).toBe(null);
        expect(error).toBeInstanceOf(AggregateError);
      });
    });

    describe('mixed result', () => {
      it('should return resolved response with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.any([
          Promise.resolve(response),
          Promise.reject(response),
        ]);

        expect(data).toBe(response);
        expect(error).toBe(null);
      });
    });
  });

  describe('race', () => {
    describe('fulfilled result', () => {
      it('should return resolved responses array with null error', async () => {
        const response = 'response';

        const [data, error] = await promiser.race([Promise.resolve(response)]);

        expect(data).toBe(response);
        expect(error).toBe(null);
      });
    });

    describe('rejected result', () => {
      it('should return null response with aggregate error', async () => {
        const response = 'response';

        const [data, error] = await promiser.race([Promise.reject(response)]);

        expect(data).toBe(null);
        expect(error).toBe(response);
      });
    });

    describe('mixed result', () => {
      describe('first result is fulfilled', () => {
        it('should return resolved responses array with null error', async () => {
          const response = 'response';

          const [data, error] = await promiser.race([
            Promise.resolve(response),
            Promise.reject(response),
          ]);

          expect(data).toBe(response);
          expect(error).toBe(null);
        });
      });

      describe('first result is rejected', () => {
        it('should return resolved responses array with null error', async () => {
          const response = 'response';

          const [data, error] = await promiser.race([
            Promise.reject(response),
            Promise.resolve(response),
          ]);

          expect(data).toBe(null);
          expect(error).toBe(response);
        });
      });
    });
  });
});
