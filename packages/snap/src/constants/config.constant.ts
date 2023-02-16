export const minaMainnetConfiguration = {
  network: 'mainnet',
  gqlUrl: '',
  txUrl: '',
  token: {
    name: 'MINA',
    coinType: 12586,
    symbol: 'MINA',
    decimals: 9,
  },
};

export const minaDevnetConfiguration = {
  network: 'devnet',
  gqlUrl: '',
  txUrl: '',
  token: {
    name: 'MINA',
    coinType: 1,
    symbol: 'MINA',
    decimals: 9,
  },
};

export const minaBerkeleyConfiguration = {
  network: 'berkeley',
  gqlUrl: 'https://proxy.berkeley.minaexplorer.com',
  txUrl: 'https://berkeley.graphql.minaexplorer.com/',
  token: {
    name: 'MINA',
    coinType: 1,
    symbol: 'MINA',
    decimals: 9,
  },
};

export const defaultConfiguration = minaBerkeleyConfiguration;
