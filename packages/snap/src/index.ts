import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import { sendTransaction, getConfiguration } from './mina';
import { TxInput } from './interfaces';
import { popupDialog } from './util/popup.util';
import { getAccountInfo, getKeyPair, signMessage } from './mina/account';
import { ESnapDialogType } from './constants/snap-method.constant';

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
  const networkConfig = await getConfiguration(snap);
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

    case EMinaMethod.NETWORK_CONFIG: {
      return networkConfig;
    }

    case EMinaMethod.SEND_TRANSACTION: {
      const txInput = request.params as TxInput;
      const response = await sendTransaction(txInput, networkConfig);
      console.log('sendTxResponse:', response);

      return response;
    }

    case EMinaMethod.SIGN_MESSAGE: {
      const keyPair = await getKeyPair(networkConfig);
      const { message } = request.params as { message: string };
      const signature = await signMessage(message, keyPair, networkConfig);
      console.log('signature:', signature);

      return signature;
    }

    default:
      throw new Error('Method not found.');
  }
};
