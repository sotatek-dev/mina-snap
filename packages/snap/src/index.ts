import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import { APIService } from './mina';
import { TrxInput } from './types/transaction.type';
import { popupConfirm } from './util/popup.util';

const apiService = new APIService();

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

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case EMinaMethod.HELLO: {
      const message = apiService.hello();
      return popupConfirm(origin, 'Description', message);
    }

    case EMinaMethod.SEND_TRANSACTION: {
      const payment = request.params as TrxInput;
      const response = await apiService.sendTransaction(payment);
      console.log('34 ---', response);

      return response;
    }

    default:
      throw new Error('Method not found.');
  }
};
