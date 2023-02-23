import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, ResultAccountList } from 'types/account';
import { Erc20TokenBalance } from 'types';
import { Transaction } from 'types';
import { ethers } from 'ethers';



export interface WalletState {
  activeAccount: string
  isInstalledWallet: boolean,
  isInstalledSnap: boolean,
  connected: boolean;
  isLoading: boolean;
  forceReconnect: boolean;
  accounts: Array<ResultAccountList>;
  erc20TokenBalances: Erc20TokenBalance[];
  erc20TokenBalanceSelected: Erc20TokenBalance;
  transactions: Transaction[];
  transactionDeploy?: Transaction;
}

const initialState: WalletState = {
  activeAccount: '',
  isInstalledWallet: false,
  isInstalledSnap: false,
  connected: false,
  isLoading: false,
  forceReconnect: false,
  accounts: [],
  erc20TokenBalances: [],
  erc20TokenBalanceSelected: {} as Erc20TokenBalance,
  transactions: [],
  transactionDeploy: undefined,
};

type ConnectWalletParams = {
  accountList: Array<ResultAccountList>,
  isInstalledSnap: boolean
}





export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setActiveAccount: (state, { payload }: PayloadAction<string>) => {
      state.activeAccount = payload;
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
    setErc20TokenBalances: (state, { payload }) => {
      state.erc20TokenBalances = payload;
    },
    upsertErc20TokenBalance: (state, { payload }) => {
      // only update erc20TokenBalances if same chainId as selected token
      if (state.erc20TokenBalanceSelected.chainId === payload.chainId) {
        const foundIndex = state.erc20TokenBalances.findIndex(
          (token) =>
            ethers.BigNumber.from(token.address).eq(ethers.BigNumber.from(payload.address)) &&
            ethers.BigNumber.from(token.chainId).eq(ethers.BigNumber.from(payload.chainId)),
        );
        if (foundIndex < 0) {
          state.erc20TokenBalances.push(payload);
        } else {
          state.erc20TokenBalances[foundIndex].amount = payload.amount;
          state.erc20TokenBalances[foundIndex].usdPrice = payload.usdPrice;

          if (
            state.erc20TokenBalanceSelected.address === state.erc20TokenBalances[foundIndex].address &&
            state.erc20TokenBalanceSelected.chainId === state.erc20TokenBalances[foundIndex].chainId
          ) {
            state.erc20TokenBalanceSelected.amount = state.erc20TokenBalances[foundIndex].amount;
            state.erc20TokenBalanceSelected.usdPrice = state.erc20TokenBalances[foundIndex].usdPrice;
          }
        }
      }
    },
    setErc20TokenBalanceSelected: (state, { payload }) => {
      state.erc20TokenBalanceSelected = payload;
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload;
    },
    setTransactionDeploy: (state, { payload }) => {
      state.transactionDeploy = payload;
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
  },
});

export const {
  setListAccounts,
  setActiveAccount,
  setIsLoading,
  connectWallet,
  setWalletInstalled,
  setWalletConnection,
  setForceReconnect,
  setAccounts,
  clearAccounts,
  setErc20TokenBalances,
  setErc20TokenBalanceSelected,
  upsertErc20TokenBalance,
  setTransactions,
  setTransactionDeploy,
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
