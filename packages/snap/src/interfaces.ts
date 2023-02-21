export type NetworkConfig = {
  name: string;
  gqlUrl: string;
  gqlTxUrl: string;
  token: {
    name: string;
    coinType: number;
    symbol: string;
    decimals: number;
  };
  currentAccIndex: number;
  generatedAccounts: any[];
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
  currentNetwork: string;
  networks: { [key: string]: NetworkConfig };
  importedAccounts: any[];
};
