import { SnapConfig } from "../interfaces";

export enum ENetworkName {
  MAINNET = 'Mainnet',
  DEVNET = 'Devnet',
  BERKELEY = 'Berkeley',
}

const networks = [
  {
    name: ENetworkName.MAINNET,
    gqlUrl: 'https://proxy.minaexplorer.com/',
    gqlTxUrl: 'https://graphql.minaexplorer.com/',
    token: {
      name: 'MINA',
      coinType: 12586,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: [],
    isSelected: false,
  },
  {
    name: ENetworkName.DEVNET,
    gqlUrl: 'https://proxy.devnet.minaexplorer.com/',
    gqlTxUrl: 'https://devnet.graphql.minaexplorer.com/',
    token: {
      name: 'MINA',
      coinType: 1,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: [],
    isSelected: false,
  },
  {
    name: ENetworkName.BERKELEY,
    gqlUrl: 'https://proxy.berkeley.minaexplorer.com',
    gqlTxUrl: 'https://berkeley.graphql.minaexplorer.com/',
    token: {
      name: 'MINA',
      coinType: 1,
      symbol: 'MINA',
      decimals: 9,
    },
    currentAccIndex: 0,
    generatedAccounts: [],
    isSelected: true, //Using Berkeley as default
  },
];

export const defaultSnapConfig: SnapConfig = {
  networks,
  importedAccounts: [],
};
