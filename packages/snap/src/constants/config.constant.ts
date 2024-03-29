import { SnapConfig } from "../interfaces";

export enum ENetworkName {
  MAINNET = 'Mainnet',
  DEVNET = 'Devnet',
  BERKELEY = 'Berkeley',
}

export const networksConstant ={
  [ENetworkName.MAINNET]: {
    name: ENetworkName.MAINNET,
    gqlUrl: 'https://proxy.minaexplorer.com/',
    gqlTxUrl: 'https://graphql.minaexplorer.com/',
    explorerUrl: 'https://minaexplorer.com/',
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
    gqlUrl: 'https://proxy.devnet.minaexplorer.com/',
    gqlTxUrl: 'https://devnet.graphql.minaexplorer.com/',
    explorerUrl: 'https://devnet.minaexplorer.com/',
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
    gqlUrl: 'https://proxy.berkeley.minaexplorer.com',
    gqlTxUrl: 'https://berkeley.graphql.minaexplorer.com/',
    explorerUrl: 'https://berkeley.minaexplorer.com/',
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
};

export const defaultSnapConfig: SnapConfig = {
  currentNetwork: ENetworkName.MAINNET,
  networks: networksConstant,
};
