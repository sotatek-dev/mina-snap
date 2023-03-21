import bs58check from "bs58check";

export const formatAccountAddress = (address: string) => {
  const firstFiveCharacters = address.slice(0, 10);
  const lastFiveCharacters = address.slice(address.length - 10, address.length);
  return firstFiveCharacters + '...' + lastFiveCharacters;
};
export const formatBalance = (balance: string, dec: number = 4): string => {
  const balanceNumb = Number(balance);
  if (balanceNumb > 0) {
    const [whole, decimal] = balance.split('.');
    const last = decimal.slice(0, dec)
    if (Number(last) === 0) {
      return whole
    }

    return whole + '.' + last
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



