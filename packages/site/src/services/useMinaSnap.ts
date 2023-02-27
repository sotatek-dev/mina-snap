
import { Account, ResultCreateAccount, ResultAccountList, PayloadChangeAccount, TypeImportAccount, TypePayloadEditAccountName } from 'types/account';

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


  const ChangeAccount = async (payload: PayloadChangeAccount): Promise<Array<ResultCreateAccount>> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_changeAccount',
          params: {
            accountIndex: payload.accountIndex,
            isImported: payload.isImported
          }
        },
      },
    });
  };

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

  const ImportAccount = async (payload: TypeImportAccount): Promise<ResultCreateAccount> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_importAccountByPrivateKey',
          params: {
            name: payload.name,
            privateKey: payload.privateKey
          }
        },
      },
    });
  };

  const EditAccountName = async (payload: TypePayloadEditAccountName): Promise<ResultCreateAccount> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_editAccountName',
          params: {
            name: payload.name,
            index: payload.index,
            isImported: payload.isImported
          }
        },
      },
    });
  };


  return {
    EditAccountName,
    ImportAccount,
    ChangeAccount,
    AccountList,
    CreateAccount,
    getAccountInfors,
    connectToSnap,
    getSnap
  };
};