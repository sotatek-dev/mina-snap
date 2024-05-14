import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResultAccountList, payloadActiveAccount } from 'types/account';
import { ResultTransactionList, TypeResponseCustomToken, TypeResponseTxHistory } from 'types/transaction';

export interface WalletState {
  accountName: string,
  balance: string,
  activeAccount: string,
  inferredNonce: string,
  isInstalledWallet: boolean,
  isInstalledSnap: boolean,
  connected: boolean;
  isLoading: boolean;
  forceReconnect: boolean;
  accounts: Array<ResultAccountList>;
  detailsAccount?: ResultAccountList;
  transactions: Array<ResultTransactionList>;
  detailTransaction?: ResultTransactionList;
  isLoadingGlobal: boolean;
  isUnlock: boolean;
  customTokens: Array<TypeResponseCustomToken>
}

const initialState: WalletState = {
  isLoadingGlobal: false,
  accountName: '',
  balance: '',
  inferredNonce: '',
  activeAccount: '',
  isInstalledWallet: false,
  isInstalledSnap: false,
  connected: false,
  isLoading: false,
  forceReconnect: false,
  accounts: [],
  transactions: [],
  detailsAccount: undefined,
  detailTransaction: undefined,
  isUnlock: false,
  customTokens: [],
};

type ConnectWalletParams = {
  accountList: Array<ResultAccountList>,
  isInstalledSnap: boolean
}





export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setDetailsAccount: (state, { payload }: PayloadAction<ResultAccountList>) => {
      state.detailsAccount = payload;
    },
    setActiveAccount: (state, { payload }: PayloadAction<payloadActiveAccount>) => {
      state.activeAccount = payload.activeAccount;
      state.balance = payload.balance
      state.accountName = payload.accountName
      state.inferredNonce = payload.inferredNonce
    },

    setSnapInstalled: (state, { payload }: PayloadAction<boolean>) => {
      state.isInstalledSnap = payload;
    },
    setWalletInstalled: (state, { payload }: PayloadAction<boolean>) => {
      state.isInstalledWallet = payload;
    },
    setWalletConnection: (state, { payload }: PayloadAction<boolean>) => {
      state.connected = payload;
    },
    setIsLoadingGlobal: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingGlobal = payload;
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    connectWallet: (state, { payload }: PayloadAction<ConnectWalletParams>) => {
      state.connected = true;
      state.isInstalledWallet = true;
      state.isInstalledSnap = true
      state.accounts = payload.accountList
      return state;
    },

    setUnlockWallet: (state, { payload }: PayloadAction<boolean>) => {
      state.isUnlock = payload;
    },

    setListAccounts: (state, { payload }: PayloadAction<Array<ResultAccountList>>) => {
      state.accounts = payload
      return state;
    },
    setForceReconnect: (state, { payload }: PayloadAction<boolean>) => {
      state.forceReconnect = payload;
    },
    setAccounts: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.accounts = payload.map((account) => account.address);
      } else {
        state.accounts.push(payload.address);
      }
    },
    clearAccounts: (state) => {
      state.accounts = [];
    },
    resetWallet: () => {
      return {
        ...initialState,
        forceReconnect: true,
      };
    },
    setTransactions: (state, { payload }: PayloadAction<TypeResponseTxHistory>) => {
      state.transactions = payload
      return state;
    },
    setCustomTokens: (state, { payload }: PayloadAction<TypeResponseCustomToken[]>) => {
      state.customTokens = payload
      return state;
    },
  },
});

export const {
  setDetailsAccount,
  setListAccounts,
  setActiveAccount,
  setIsLoading,
  connectWallet,
  setWalletInstalled,
  setWalletConnection,
  setForceReconnect,
  setAccounts,
  clearAccounts,
  setTransactions,
  resetWallet,
  setIsLoadingGlobal,
  setUnlockWallet,
  setCustomTokens,
} = walletSlice.actions;

export default walletSlice.reducer;
