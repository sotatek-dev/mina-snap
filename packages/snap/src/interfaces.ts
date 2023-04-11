import { ENetworkName } from './constants/config.constant';

export type NormalAccountOptions = {
  [index: number]: {
    name: string;
    address: string;
  };
};

export type ImportedAccountOptions = {
  [index: number]: {
    name: string;
    address: string;
    privateKey: string;
  };
};

export type NetworkConfig = {
  name: string;
  gqlUrl: string;
  gqlTxUrl: string;
  explorerUrl: string;
  token: {
    name: string;
    coinType: number;
    symbol: string;
    decimals: number;
  };
  currentAccIndex: number;
  generatedAccounts: NormalAccountOptions;
  selectedImportedAccount: number | null;
  importedAccounts: ImportedAccountOptions;
};

export type SnapState = {
  mina: SnapConfig;
};

export type TxInput = {
  to: string;
  amount: number;
  fee: number;
  memo?: string;
  nonce?: number;
};

export type SnapConfig = {
  currentNetwork: ENetworkName;
  networks: { [key: string]: NetworkConfig };
};

export type HistoryOptions = {
  limit: number;
  sortBy:
    | 'AMOUNT_ASC'
    | 'AMOUNT_DESC'
    | 'BLOCKHEIGHT_ASC'
    | 'BLOCKHEIGHT_DESC'
    | 'BLOCKSTATEHASH_DESC'
    | 'BLOCKSTATEHASH_ASC'
    | 'DATETIME_ASC'
    | 'DATETIME_DESC'
    | 'FAILUREREASON_ASC'
    | 'FAILUREREASON_DESC'
    | 'FEE_ASC'
    | 'FEE_DESC'
    | 'FEETOKEN_ASC'
    | 'FEETOKEN_DESC'
    | 'FROM_ASC'
    | 'FROM_DESC'
    | 'HASH_ASC'
    | 'HASH_DESC'
    | 'ID_ASC'
    | 'ID_DESC'
    | 'KIND_ASC'
    | 'KIND_DESC'
    | 'MEMO_ASC'
    | 'MEMO_DESC'
    | 'NONCE_ASC'
    | 'NONCE_DESC'
    | 'TO_DESC'
    | 'TO_ASC'
    | 'TOKEN_DESC'
    | 'TOKEN_ASC';
  canonical: boolean;
};

export type VerifyMessageInput = {
  publicKey: string;
  data: string;
  signature: {
    field: string;
    scalar: string;
  };
};

export type StakeTxInput = {
  to: string;
  fee: number;
  memo?: string;
  nonce?: number;
};

export type ZkAppTxInput = {
  transaction: any;
  feePayer: any;
};
