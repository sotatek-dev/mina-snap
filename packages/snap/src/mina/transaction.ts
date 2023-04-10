import BigNumber from 'bignumber.js';
import { Payment, Signed, StakeDelegation } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import { gql } from '../graphql';
import {
  getTxHistoryQuery,
  getTxDetailQuery,
  sendPaymentQuery,
  getTxStatusQuery,
  TxPendingQuery,
  sendStakeDelegationGql,
  getPartyBody,
} from '../graphql/gqlparams';
import { HistoryOptions, NetworkConfig, StakeTxInput, TxInput } from '../interfaces';
import { decodeMemo } from '../util/helper';
import { getMinaClient } from '../util/mina-client.util';
import { popupNotify } from '../util/popup.util';
import { getAccountInfo, getKeyPair } from './account';
import { ENetworkName } from '../constants/config.constant';

/**
 * Sign user payment.
 *
 * @param args - The request handler args as object.
 * @param args.from - Public key of sender of payment.
 * @param args.to - Public key of recipient of payment.
 * @param args.amount - Amount of MINA to send to receiver.
 * @param args.fee - Fee amount in order to send payment.
 * @param args.nonce - Should only be set when cancelling transactions, otherwise a nonce is determined automatically.
 * @param args.memo - Short arbitrary message provided by the sender.
 * @param args.validUntil - The global slot since genesis after which this transaction cannot be applied.
 * @param publicKey - Sender address.
 * @param privateKey - User private key for signing payment.
 * @param networkConfig - Selected network config.
 * @returns `null` if sign payment failed, else return signed payment.
 */
export const signPayment = async (
  args: TxInput,
  publicKey: string,
  privateKey: string,
  networkConfig: NetworkConfig,
) => {
  const client = getMinaClient(networkConfig);
  const { amount, fee, to, memo, nonce } = args;
  const { account } = await getAccountInfo(publicKey, networkConfig);

  try {
    const decimal = new BigNumber(10).pow(networkConfig.token.decimals);
    const sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
    const sendAmount = new BigNumber(amount).multipliedBy(decimal).toNumber();

    const payment = {
      from: publicKey,
      to,
      amount: sendAmount,
      fee: sendFee,
      nonce: nonce || account.inferredNonce,
      memo,
    };
    return client.signPayment(payment, privateKey);
  } catch (err) {
    console.error('packages/snap/src/mina/transaction.ts:51', err.message);
    throw err;
  }
};

/**
 * Send payment.
 *
 * @param signedPayment - Signed payment.
 * @param networkConfig - Selected network config.
 * @returns `null` if error.
 */
export async function submitPayment(signedPayment: Signed<Payment>, networkConfig: NetworkConfig) {
  const query = sendPaymentQuery(false);
  const variables = { ...signedPayment.data, ...signedPayment.signature };

  const data = await gql(networkConfig.gqlUrl, query, variables);

  await popupNotify(`Payment ${data.sendPayment.payment.hash.substring(0, 10)}... has been submitted`);
  data.sendPayment.payment.memo = decodeMemo(data.sendPayment.payment.memo);

  return data.sendPayment.payment;
}

export async function getTxHistory(networkConfig: NetworkConfig, options: HistoryOptions, address: string) {
  const { pooledUserCommands: pendingTxs } = await gql(networkConfig.gqlUrl, TxPendingQuery(), { address });
  pendingTxs.forEach((tx: any) => {
    tx.memo = decodeMemo(tx.memo);
    tx.status = 'PENDING';
  });

  const { transactions } = await gql(networkConfig.gqlTxUrl, getTxHistoryQuery(), { ...options, address });
  transactions.forEach((tx: any) => {
    tx.memo = decodeMemo(tx.memo);
    tx.status = tx.failureReason ? 'FAILED' : 'APPLIED';
  });

  return [...pendingTxs.reverse(), ...transactions];
}

export async function getTxDetail(networkConfig: NetworkConfig, hash: string) {
  const query = getTxDetailQuery();
  const variables = { hash };

  const data = await gql(networkConfig.gqlTxUrl, query, variables);

  return data;
}

export async function getTxStatus(networkConfig: NetworkConfig, paymentId: string) {
  const query = getTxStatusQuery();
  const variables = { paymentId };

  const data = await gql(networkConfig.gqlUrl, query, variables);

  return data;
}

export const signStakeDelegation = async (
  args: StakeTxInput,
  publicKey: string,
  privateKey: string,
  networkConfig: NetworkConfig,
) => {
  const client = getMinaClient(networkConfig);
  const { to, fee, memo, nonce } = args;
  const { account } = await getAccountInfo(publicKey, networkConfig);
  try {
    let decimal = new BigNumber(10).pow(networkConfig.token.decimals);
    let sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
    const stakeTx = {
      to,
      from: publicKey,
      fee: sendFee,
      nonce: nonce || account.inferredNonce,
      memo,
    };
    return client.signStakeDelegation(stakeTx, privateKey);
  } catch (err) {
    console.error('Sign stake delegation tx error:', err.message);
    throw err;
  }
};

export const submitStakeDelegation = async (signedStakeTx: Signed<StakeDelegation>, networkConfig: NetworkConfig) => {
  const txGql = sendStakeDelegationGql(false);
  const variables = { ...signedStakeTx.data, ...signedStakeTx.signature };

  const data = await gql(networkConfig.gqlUrl, txGql, variables);

  await popupNotify(`Stake delegation ${data.sendDelegation.delegation.hash.substring(0, 10)}... has been submitted`);

  return data.sendDelegation.delegation;
};

export const submitZkAppTx = async (params: { transaction: any; feePayer: any }, networkConfig: NetworkConfig) => {
  if (networkConfig.name !== ENetworkName.BERKELEY) {
    throw new Error('ZkApp transaction only available on Berkeley');
  }
  try {
    const client = getMinaClient(networkConfig);
    const { publicKey, privateKey } = await getKeyPair();
    const { account } = await getAccountInfo(publicKey, networkConfig);
    let decimal = new BigNumber(10).pow(networkConfig.token.decimals);
    let sendFee = new BigNumber(params.feePayer.fee).multipliedBy(decimal).toNumber();

    const payload: any = {
      zkappCommand: JSON.parse(params.transaction),
      feePayer: {
        feePayer: publicKey,
        fee: sendFee,
        nonce: account.inferredNonce,
        memo: params.feePayer.memo || '',
      },
    };
    const signedTx = client.signTransaction(payload, privateKey);
    const txGql = getPartyBody();
    const variables = {
      zkappCommandInput: signedTx.data.zkappCommand,
    };
    const sendPartyRes = await gql(networkConfig.gqlUrl, txGql, variables);
    return sendPartyRes;
  } catch (error) {
    console.error('Failed to submitZkAppTx:', error.message);
    throw error;
  }
};
