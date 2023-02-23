import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import { sendTransaction, getNetworkConfig, changeNetwork, resetSnapConfiguration, getSnapConfiguration } from './mina';
import { HistoryOptions, TxInput } from './interfaces';
import { popupDialog } from './util/popup.util';
import { changeAccount, createAccount, editAccountName, getAccountInfo, getAccounts, getKeyPair, importAccount, signMessage } from './mina/account';
import { ESnapDialogType } from './constants/snap-method.constant';
import { ENetworkName } from './constants/config.constant';
import { getTxHistory, getTxDetail } from './mina/transaction';
import { updateSnapConfig } from './mina/configuration';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns .
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  const networkConfig = networks[currentNetwork];
  console.log(`-networkConfig:`, networkConfig);
  if (Object.keys(networks[currentNetwork].generatedAccounts).length === 0) {
    await createAccount('Account 1');
  }
  switch (request.method) {
    case EMinaMethod.HELLO: {
      return popupDialog(ESnapDialogType.CONFIRMATION, 'Hello Mina', 'Hello');
    }

    case EMinaMethod.ACCOUNT_INFO: {
      const { publicKey, name } = await getKeyPair();
      const { account } = await getAccountInfo(publicKey, networkConfig);
      account.name = name;
      return account;
    }

    case EMinaMethod.ACCOUNT_LIST: {
      const accounts = await getAccounts();
      console.log(`-accounts:`, accounts);
      return accounts;
    }

    case EMinaMethod.CREATE_ACCOUNT: {
      const { name, index } = request.params as { name: string; index?: number };
      const account = await createAccount(name, index);
      console.log(`-new account:`, account);
      return account;
    }

    case EMinaMethod.EDIT_ACCOUNT_NAME: {
      const { index, name, isImported } = request.params as { index: number; name: string; isImported?: boolean };
      const account = await editAccountName(index, name, isImported);
      console.log(`-edited account:`, account);
      return account;
    }

    case EMinaMethod.CHANGE_NETWORK: {
      const { networkName } = request.params as { networkName: ENetworkName };
      const newNetwork = await changeNetwork(networkName);
      return newNetwork;
    }

    case EMinaMethod.CHANGE_ACCOUNT: {
      const { accountIndex, isImported } = request.params as { accountIndex: number; isImported?: boolean };
      const accountInfo = await changeAccount(accountIndex, isImported);
      return accountInfo;
    }

    case EMinaMethod.IMPORT_ACCOUNT_PK: {
      const { name, privateKey } = request.params as { name: string; privateKey: string }
      const accountInfo = await importAccount(name, privateKey);
      console.log(`-Imported account:`, accountInfo);
      return accountInfo;
    }

    case EMinaMethod.NETWORK_CONFIG: {
      return networkConfig;
    }

    case EMinaMethod.SEND_PAYMENT: {
      const txInput = request.params as TxInput;
      const response = await sendTransaction(txInput, networkConfig);
      console.log('sendTxResponse:', response);

      return response;
    }

    case EMinaMethod.SIGN_MESSAGE: {
      const keyPair = await getKeyPair();
      const { message } = request.params as { message: string };
      const signature = signMessage(message, keyPair, networkConfig);
      console.log('signature:', signature);

      return signature;
    }

    case EMinaMethod.RESET_CONFIG: {
      return resetSnapConfiguration();
    }

    case EMinaMethod.GET_TX_HISTORY: {
      const keyPair = await getKeyPair();
      const history = await getTxHistory(networkConfig, request.params as HistoryOptions, keyPair.publicKey);
      console.log(history);

      return history;
    }

    case EMinaMethod.GET_TX_DETAIL: {
      const { hash } = request.params as { hash: string };
      const payment = await getTxDetail(networkConfig, hash);
      console.log(payment);

      return payment;
    }

    default:
      throw new Error('Method not found.');
  }
};
