export const printBanner = (text: string) => {
  const n = text.length;
  const hr = '='.repeat(n);

  console.log(hr);
  console.log(text);
  console.log(hr);
};
