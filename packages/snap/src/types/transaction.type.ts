export type TrxInput = {
  to: string;
  amount: number;
  fee: number;
  memo?: string;
  validUntil?: number;
};
