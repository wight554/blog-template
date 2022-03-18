export const prettyPrintAddress = (address: string) => {
  const prettyAddress = address.replace(/(0.0.0.0|127.0.0.1)/, 'localhost');
  const printMessage = `Server running at \x1b[36m${prettyAddress}\x1b[0m`;

  console.log();
  console.log(printMessage);
  console.log();
};
