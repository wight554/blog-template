import { LoaderFunction, redirect } from 'react-router-dom';

import { queryClient } from '#src/api/queryClient.js';
import { userQuery } from '#src/services/user.js';

const waitUntilUserLoaded = () =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!queryClient.isFetching(userQuery.queryKey)) {
        clearInterval(interval);

        resolve(queryClient.getQueryData(userQuery.queryKey));
      }
    }, 50);
  });

export const loader: LoaderFunction = async () => {
  const user = await waitUntilUserLoaded();

  if (user) {
    return redirect('/');
  }
};

export { Login } from '#src/components/Login/index.js';
