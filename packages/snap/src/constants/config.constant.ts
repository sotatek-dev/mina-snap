export const minaMainnetConfiguration = {
  network: 'mainnet',
  gqlUrl: 'https://proxy.minaexplorer.com/',
  gqlTxUrl: 'https://graphql.minaexplorer.com/',
  token: {
    name: 'MINA',
    coinType: 12586,
    symbol: 'MINA',
    decimals: 9,
  },
};

export const minaDevnetConfiguration = {
  network: 'devnet',
  gqlUrl: 'https://proxy.devnet.minaexplorer.com/',
  gqlTxUrl: 'https://devnet.graphql.minaexplorer.com/',
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
  gqlTxUrl: 'https://berkeley.graphql.minaexplorer.com/',
  token: {
    name: 'MINA',
    coinType: 1,
    symbol: 'MINA',
    decimals: 9,
  },
};

export const defaultConfiguration = minaBerkeleyConfiguration;
