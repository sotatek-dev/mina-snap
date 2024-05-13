import { SnapConfig } from "../interfaces";

export enum ENetworkName {
  MAINNET = 'Mainnet',
  DEVNET = 'Devnet',
  BERKELEY = 'Berkeley',
}

export const networksConstant = {
  [ENetworkName.MAINNET]: {
    name: ENetworkName.MAINNET,
    gqlUrl: 'https://proxy.minaexplorer.com/graphql/',
    gqlTxUrl: 'https://graphql.minaexplorer.com/',
    explorerUrl: 'https://minascan.io/mainnet/',
    token: {
      name: 'MINA',
      coinType: 12586,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: {},
    selectedImportedAccount: null,
    importedAccounts: {},
  },
  [ENetworkName.DEVNET]: {
    name: ENetworkName.DEVNET,
    gqlUrl: 'https://api.minascan.io/node/devnet/v1/graphql',
    gqlTxUrl: 'https://devnet.graphql.minaexplorer.com/',
    explorerUrl: 'https://minascan.io/devnet/',
    token: {
      name: 'MINA',
      coinType: 1,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: {},
    selectedImportedAccount: null,
    importedAccounts: {},
  },
  [ENetworkName.BERKELEY]: {
    name: ENetworkName.BERKELEY,
    gqlUrl: 'https://api.minascan.io/node/berkeley/v1/graphql',
    gqlTxUrl: 'https://berkeley.graphql.minaexplorer.com/',
    explorerUrl: 'https://minascan.io/berkeley/',
    token: {
      name: 'MINA',
      coinType: 1,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: {},
    selectedImportedAccount: null,
    importedAccounts: {},
  }
};

export const defaultSnapConfig: SnapConfig = {
  currentNetwork: ENetworkName.MAINNET,
  networks: networksConstant,
};
