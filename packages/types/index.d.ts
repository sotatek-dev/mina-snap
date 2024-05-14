/** Response types */
export type NetworkConfigResponse = {
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
};

export enum ENetworkName {
  MAINNET = "Mainnet",
  DEVNET = "Devnet",
  BERKELEY = "Berkeley",
}

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
};

export type CreateAccountResponse = {
  name: string;
  address: string;
  balance: string;
  inferredNonce: string;
};

export type AccountsListResponse = {
  name: string;
  address: string;
  index?: number;
  balance?: { total: string };
  isImported?: boolean;
}[];

export type AccountResponse = {
  name: string;
  publicKey: string;
  balance: { total: string };
  inferredNonce: string;
  nonce: string;
};

export type ChangeAccountResponse = {
  name: string;
  address: string;
};

export type ImportAccountResponse = {
  name: string;
  address: string;
  balance: string;
  inferredNonce: string;
};

export type ExportPrivateKeyResponse = {
  privateKey: string;
};

export type SignatureResponse = {
  data: any;
  publickey: string;
  signature: {
    field: string;
    scalar: string;
  };
};

export type SendTransactionResponse = {
  id: string;
  hash: string;
  isDelegation: boolean;
  kind: string;
};

export type TransactionListResponse = {
  amount: number;
  dateTime: string;
  failureReason: string;
  fee: number;
  feeToken: string;
  hash: string;
  id: string;
  isDelegation: boolean;
  kind: string;
  memo: string;
  nonce: number;
  receiver: {
    publicKey: string;
  };
  source: {
    publicKey: string;
  };
  status: string;
}[];

