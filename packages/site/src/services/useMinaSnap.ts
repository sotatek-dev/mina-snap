
import { Account, ResultCreateAccount, ResultAccountList } from 'types/account';

export const useMinaSnap = () => {
  const { ethereum } = window as any;
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : 'local:http://localhost:8080/';
  const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : '*';


  const connectToSnap = async () => {
    await ethereum.request({ method: 'wallet_requestSnaps', params: { [snapId]: { snapVersion } } })
  };

  const getSnap = async () => {
    return await ethereum.request({ method: 'wallet_getSnaps' });
  };

  const getAccountInfors = async (): Promise<Account> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_accountInfo',
        },
      },
    });
  };

  const CreateAccount = async (name: string): Promise<ResultCreateAccount> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_createAccount',
          params: {
            name: name
          }
        },
      },
    });
  };
  // mina_accountList

  const AccountList = async (): Promise<Array<ResultAccountList>> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_accountList',

        },
      },
    });
  };

  return {
    AccountList,
    CreateAccount,
    getAccountInfors,
    connectToSnap,
    getSnap
  };
};