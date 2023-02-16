import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import { sendTransaction, getConfiguration } from './mina';
import { TxInput } from './interfaces';
import { getAccountInfo, getKeyPair } from './mina/account';

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
  const networkConfig = await getConfiguration(wallet);
  console.log(`-networkConfig:`, networkConfig);
  switch (request.method) {
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

    default:
      throw new Error('Method not found.');
  }
};
