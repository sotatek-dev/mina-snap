import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import { sendTransaction, getNetworkConfig, changeNetwork, resetSnapConfiguration } from './mina';
import { HistoryOptions, TxInput } from './interfaces';
import { popupDialog } from './util/popup.util';
import { changeAccount, getAccountInfo, getKeyPair, signMessage } from './mina/account';
import { ESnapDialogType } from './constants/snap-method.constant';
import { ENetworkName } from './constants/config.constant';
import { getTxHistory, getTxDetail, getTxStatus } from './mina/transaction';

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
  const networkConfig = await getNetworkConfig();
  console.log(`-networkConfig:`, networkConfig);
  switch (request.method) {
    case EMinaMethod.HELLO: {
      return popupDialog(ESnapDialogType.CONFIRMATION, 'Hello Mina', 'Hello');
    }

    case EMinaMethod.ACCOUNT_INFO: {
      const { publicKey } = await getKeyPair(networkConfig);
      const { account } = await getAccountInfo(publicKey, networkConfig);
      return account;
    }

    case EMinaMethod.CHANGE_NETWORK: {
      const { networkName } = request.params as { networkName: ENetworkName };
      const newNetwork = await changeNetwork(networkName);
      return newNetwork;
    }

    case EMinaMethod.CHANGE_ACCOUNT: {
      const { accountIndex } = request.params as { accountIndex: number };
      const accountInfo = await changeAccount(accountIndex);
      return accountInfo;
    }

    // case EMinaMethod.IMPORT_ACCOUNT: {
    //   const { privateKey } = request.params as { privateKey: string }
    // }

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
      const keyPair = await getKeyPair(networkConfig);
      const { message } = request.params as { message: string };
      const signature = signMessage(message, keyPair, networkConfig);
      console.log('signature:', signature);

      return signature;
    }

    case EMinaMethod.RESET_CONFIG: {
      return resetSnapConfiguration();
    }

    case EMinaMethod.GET_TX_HISTORY: {
      const keyPair = await getKeyPair(networkConfig);
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

    case EMinaMethod.GET_TX_STATUS: {
      const { paymentId } = request.params as { paymentId: string };
      const status = await getTxStatus(networkConfig, paymentId);
      console.log(status);

      return status;
    }

    default:
      throw new Error('Method not found.');
  }
};
