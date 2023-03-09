import bs58check from "bs58check";

export const formatAccountAddress = (address: string) => {
  const firstFiveCharacters = address.slice(0, 10);
  const lastFiveCharacters = address.slice(address.length - 10, address.length);
  return firstFiveCharacters + '...' + lastFiveCharacters;
};
export const formatBalance = (balance: string) => {
  if (Number(balance) > 0) {
    const firstFiveCharacters = balance.slice(0, balance.length - 9);
    const lastFiveCharacters = balance.slice(balance.length - 9, balance.length);
    return firstFiveCharacters + '.' + lastFiveCharacters;
  }
  return '0'
};

export const addressValid = (address: string) => {
  try {
    let decodedAddress = bs58check.decode(address).toString();
    return !!decodedAddress && address.length === 55;
  } catch (ex) {
    return false
  }
}

