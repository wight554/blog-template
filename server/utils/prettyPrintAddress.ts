import { printBanner } from '@server/utils/printBanner';

export const prettyPrintAddress = (address: string) => {
  const prettyAddress = address.replace(/(0.0.0.0|127.0.0.1)/, 'localhost');
  const message = `Server running at ${prettyAddress}`;

  printBanner(message);
};
