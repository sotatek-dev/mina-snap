export type NetworkConfig = {
  network: string;
  gqlUrl: string;
  txUrl: string;
  token: {
    name: string;
    coinType: number;
    symbol: string;
    decimals: number;
  };
};

export type SnapState = {
  mina: {
    config: NetworkConfig;
  };
};

export type TxInput = {
  to: string;
  amount: number;
  fee: number;
  memo?: string;
  nonce?: number;
};
