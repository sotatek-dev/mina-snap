import { OnRpcRequestHandler } from '@metamask/snap-types';
import { EMinaMethod } from './constants/mina-method.constant';
import {
  sendPayment,
  changeNetwork,
  resetSnapConfiguration,
  getSnapConfiguration,
  sendStakeDelegation,
  getNetworkConfig,
  sendZkAppTx,
} from './mina';
import { HistoryOptions, StakeTxInput, TxInput, ZkAppTxInput } from './interfaces';
import { popupDialog, popupNotify } from './util/popup.util';
import {
  changeAccount,
  createAccount,
  editAccountName,
  getAccountInfo,
  getAccounts,
  getKeyPair,
  importAccount,
  signMessage,
  verifyMessage,
} from './mina/account';
import { ESnapDialogType } from './constants/snap-method.constant';
import { ENetworkName } from './constants/config.constant';
import { getTxHistory, getTxDetail, getTxStatus } from './mina/transaction';
import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/types';
import { Mutex } from 'async-mutex';
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
const mutex = new Mutex();
export const onRpcRequest: OnRpcRequestHandler = async ({ request, origin }) => {
  return mutex.runExclusive(async () => {
    const snapConfig = await getSnapConfiguration();
    const networkConfig = await getNetworkConfig(snapConfig);
    if (Object.keys(networkConfig.generatedAccounts).length === 0) {
      await createAccount('Account 1');
    }
    switch (request.method) {
      case EMinaMethod.ACCOUNT_INFO: {
        const params = request?.params as { tokenId?: string };
        const tokenId = params?.tokenId;
        const { publicKey, name } = await getKeyPair();
        const { account } = await getAccountInfo(publicKey, networkConfig, tokenId);
        account.name = name;
        return account;
      }

      case EMinaMethod.ACCOUNT_LIST: {
        const accounts = await getAccounts();
        return accounts;
      }

      case EMinaMethod.CREATE_ACCOUNT: {
        const { name } = request.params as { name: string };
        const account = await createAccount(name);
        return account;
      }

      case EMinaMethod.EDIT_ACCOUNT_NAME: {
        const { index, name, isImported } = request.params as { index: number; name: string; isImported?: boolean };
        const account = await editAccountName(index, name, isImported);
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
        const { name, privateKey } = request.params as { name: string; privateKey: string };
        const accountInfo = await importAccount(name, privateKey);
        return accountInfo;
      }

      case EMinaMethod.EXPORT_PRIVATE_KEY: {
        const { index, isImported } = request.params as { index?: number; isImported?: boolean };
        const confirmation = await popupDialog(
          ESnapDialogType.CONFIRMATION,
          `Do you want to export your private key?`,
          [
            {
              text: `Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.`, divider: true
            },
            { text: 'Request origin:', copyable: `${origin}` },
          ],
        );
        if (!confirmation) {
          await popupNotify('Exporting private key is rejected');
          return null;
        } else {
          const { privateKey } = await getKeyPair(index, isImported);
          return { privateKey };
        }
      }

      case EMinaMethod.NETWORK_CONFIG: {
        const { name, gqlUrl, gqlTxUrl, explorerUrl, token } = networkConfig;
        return {
          name,
          gqlUrl,
          gqlTxUrl,
          explorerUrl,
          token,
        };
      }

      case EMinaMethod.SEND_PAYMENT: {
        const txInput = request.params as TxInput;
        const response = await sendPayment(txInput, networkConfig, origin);

        return response;
      }

      case EMinaMethod.SIGN_MESSAGE: {
        const keyPair = await getKeyPair();
        const { message } = request.params as { message: string };
        const signature = await signMessage(message, keyPair, networkConfig, origin);

        return signature;
      }

      case EMinaMethod.RESET_CONFIG: {
        const confirmation = await popupDialog(
          ESnapDialogType.CONFIRMATION,
          `Do you want to reset the Mina Portal config?`,
          [
            {
              text: `Warning: This will clear all your Mina Portal configs on this device and may result in loss of access to accounts.`, divider: true
            },
            { text: 'Request origin:', copyable: `${origin}` },
          ],
        );
        if (!confirmation) {
          await popupNotify('Reset snap config is rejected');
          return null;
        }
        const defaultConfig = await resetSnapConfiguration();
        return defaultConfig;
      }

      case EMinaMethod.GET_TX_HISTORY: {
        const keyPair = await getKeyPair();
        const history = await getTxHistory(networkConfig, request.params as HistoryOptions, keyPair.publicKey);

        return history;
      }

      case EMinaMethod.GET_TX_DETAIL: {
        const { hash } = request.params as { hash: string };
        const payment = await getTxDetail(networkConfig, hash);

        return payment;
      }

      case EMinaMethod.GET_TX_STATUS: {
        const { paymentId } = request.params as { paymentId: string };
        const status = await getTxStatus(networkConfig, paymentId);

        return status;
      }

      case EMinaMethod.VERIFY_MESSAGE: {
        const signedData = request.params as SignedLegacy<any>;
        const verifyResult = verifyMessage(networkConfig, signedData);
        return verifyResult;
      }

      case EMinaMethod.SEND_STAKE_DELEGATION: {
        const stakeTxInput = request.params as StakeTxInput;
        const response = await sendStakeDelegation(stakeTxInput, networkConfig, origin);

        return response;
      }

      case EMinaMethod.REQUEST_NETWORK_NAME: {
        return networkConfig.name;
      }

      case EMinaMethod.SEND_TX: {
        const args = request.params as ZkAppTxInput;
        const submitZkAppResult = await sendZkAppTx(args, networkConfig, origin);
        return submitZkAppResult;
      }

      default:
        throw new Error('Method not found.');
    }
  });
};
