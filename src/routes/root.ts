import { LoaderFunction } from 'react-router-dom';

import { promiser } from '#src/api/promiser.js';
import { queryClient } from '#src/api/queryClient.js';
import { userQuery } from '#src/services/user.js';

export const loader: LoaderFunction = async () => {
  if (!queryClient.getQueryState(userQuery.queryKey)) {
    await promiser(queryClient.fetchQuery(userQuery));
  }
};

export { App as Root } from '#src/components/App/index.js';
