import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';

import { User } from '#src/interfaces/model/User.js';
import { userQuery } from '#src/services/user.js';

const waitUntilUserLoaded = (queryClient: QueryClient): Promise<User | undefined> =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!queryClient.isFetching(userQuery.queryKey)) {
        clearInterval(interval);

        resolve(queryClient.getQueryData(userQuery.queryKey));
      }
    }, 50);
  });

export const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const user = await waitUntilUserLoaded(queryClient);

    console.log(user);

    if (user) {
      return redirect('/');
    }

    return user;
  };

export { Login } from '#src/components/Login/index.js';
