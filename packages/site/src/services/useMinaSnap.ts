import { payloadSendZkTransaction, TypeResponseSwtichNetwork } from './../types/transaction';



import {
  Account,
  ResultCreateAccount,
  ResultAccountList,
  PayloadChangeAccount,
  TypeImportAccount,
  TypePayloadEditAccountName,
  ResponseExportPrivateKey,

} from 'types/account';
import { TypeResponseSendTransaction, payloadSendTransaction, TypeResponseSignature, TypeResponseTxHistory } from 'types/transaction';
import { ResponeseZkTransaction, ResponseNetworkConfig } from 'types/snap';
import { getLatestSnapVersion } from 'utils/utils';

export const useMinaSnap = () => {
  const { ethereum } = window as any;
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : 'npm:mina-portal';
  const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : '*';

  const getProvider = async () => {
    let mmFound = false;
    if ('detected' in ethereum) {
      for (const provider of ethereum.detected) {
        try {
          // Detect snaps support
          await provider.request({
            method: 'wallet_getSnaps',
          });
          // enforces MetaMask as provider
          ethereum.setProvider(provider);

          mmFound = true;
          return provider;
        } catch {
          // no-op
        }
      }
    }

    if(!mmFound && 'providers' in ethereum) {
      for (const provider of ethereum.providers) {
        try {
          // Detect snaps support
          await provider.request({
            method: 'wallet_getSnaps',
          });
          window.ethereum = provider
          mmFound = true;
          return provider;
        } catch {
          // no-op
        }
      }
    }

    return ethereum;
  };


  const connectToSnap = async () => {
      let version = snapVersion;
      if (/local:/.test(snapId)) {
        version = '*';
      }
      console.log({ version })
      return await ethereum.request({
        method: 'wallet_requestSnaps',
        params: { [snapId]: { version: `${version}` } } })
  };

  const getSnap = async () => {
    const provider = await getProvider();
    return await provider.request({ method: 'wallet_getSnaps' });
  };

  const getAccountInfors = async (tokenId?: string): Promise<Account> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_accountInfo',
          params: { tokenId }
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

  const ExportPrivateKey = async (payload: PayloadChangeAccount): Promise<ResponseExportPrivateKey> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_exportPrivateKey',
          params: {
            index: payload.accountIndex,
            isImported: payload.isImported
          }
        },
      },
    });
  };

  const SendTransaction = async (payload: payloadSendTransaction): Promise<TypeResponseSendTransaction> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_sendPayment',
          params: {
            to: payload.to,
            amount: payload.amount,
            fee: payload.fee,
            memo: payload.memo,
            nonce: payload.nonce,
            validUntil: 0
          }
        },
      },
    });
  };

  const getTxHistory = async (): Promise<TypeResponseTxHistory> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_getTxHistory',
          params: {
            limit: 51,
            sortBy: "DATETIME_DESC",
            canonical: true
          }
        },
      },
    });
  };

  const Signature = async (payload: string): Promise<TypeResponseSignature> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_signMessage',
          params: {
            message: payload
          }
        },
      },
    });
  };

  const SwitchNetwork = async (payload: string): Promise<TypeResponseSwtichNetwork> => {
    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_changeNetwork',
          params: {
            networkName: payload
          }
        },
      },
    });
  };

  const RequestSnap = async (): Promise<any> => {
    return await ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        'npm:mina-portal': {

        },
      },
    });
  };

  const GetNetworkConfigSnap = async (): Promise<ResponseNetworkConfig> => {

    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_networkConfig',

        },
      },
    });
  };

  const sendZkTransaction = async (payload: payloadSendZkTransaction): Promise<ResponeseZkTransaction> => {

    return await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: snapId,
        request: {
          method: 'mina_sendTransaction',
          params: {
            transaction: payload.transaction,
            feePayer: {
              fee: payload.feePayer.fee,
              memo: payload.feePayer.memo,
            }
          }
        },
      },
    });
  };


  return {
    GetNetworkConfigSnap,
    RequestSnap,
    SwitchNetwork,
    Signature,
    ExportPrivateKey,
    EditAccountName,
    ImportAccount,
    ChangeAccount,
    AccountList,
    CreateAccount,
    getAccountInfors,
    connectToSnap,
    getSnap,
    SendTransaction,
    getTxHistory,
    sendZkTransaction
  };
};
