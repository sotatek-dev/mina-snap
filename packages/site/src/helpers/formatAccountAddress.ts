export const formatAccountAddress = (address: string) => {
  const firstFiveCharacters = address.slice(0, 10);
  const lastFiveCharacters = address.slice(address.length - 10, address.length);
  return firstFiveCharacters + '...' + lastFiveCharacters;
};
export const formatBalance = (balance: string) => {
  const firstFiveCharacters = balance.slice(0, balance.length - 9);
  const lastFiveCharacters = balance.slice(balance.length - 9, balance.length);
  return firstFiveCharacters + '.' + lastFiveCharacters;
};


