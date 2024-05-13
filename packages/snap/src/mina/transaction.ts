import BigNumber from 'bignumber.js';
import {
  Payment,
  Signed,
  SignedLegacy,
  StakeDelegation,
  ZkappCommand,
} from 'mina-signer/dist/node/mina-signer/src/types';
import { gql } from '../graphql';
import {
  getTxHistoryQuery,
  getTxDetailQuery,
  sendPaymentQuery,
  getTxStatusQuery,
  TxPendingQuery,
  sendStakeDelegationGql,
  getPartyBody,
  getPendingZkAppTxBody,
  getZkAppTransactionListBody,
} from '../graphql/gqlparams';
import { HistoryOptions, NetworkConfig, StakeTxInput, TxInput, ZkAppTxInput } from '../interfaces';
import { decodeMemo, formatZkAppTxList } from '../util/helper';
import { getMinaClient } from '../util/mina-client.util';
import { popupNotify } from '../util/popup.util';
import { getAccountInfo } from './account';
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
    console.error('packages/snap/src/mina/transaction.ts', err.message);
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
export async function submitPayment(signedPayment: SignedLegacy<Payment>, networkConfig: NetworkConfig) {
  const query = sendPaymentQuery(false);
  const variables = { ...signedPayment.data, ...signedPayment.signature };
  const data = await gql(networkConfig.gqlUrl, query, variables).catch(error => {
    console.log(`Submit payment error:`, error);
    return null;
  });
  if (!data) {
    return data;
  }
  const { hash } = data.sendPayment.payment
  await popupNotify(`Payment ${hash.slice(0,5) + "..." + hash.slice(-5)} has been submitted`);
  data.sendPayment.payment.memo = decodeMemo(data.sendPayment.payment.memo);

  return data.sendPayment.payment;
}

export async function getTxHistory(networkConfig: NetworkConfig, options: HistoryOptions, address: string) {
  let getPendingTxList = gql(networkConfig.gqlUrl, TxPendingQuery(), { address }).catch(()=> { return { pooledUserCommands: [] } });
  let getTxList = gql(networkConfig.gqlTxUrl, getTxHistoryQuery(), { ...options, address }).catch(()=> { return { transactions: [] } });
  let getZkAppTxList: any = { zkapps: [] };
  let getZkAppPending: any = { pooledZkappCommands: [] };
  if (networkConfig.name === ENetworkName.DEVNET || networkConfig.name === ENetworkName.BERKELEY) {
    getZkAppTxList = gql(networkConfig.gqlTxUrl, getZkAppTransactionListBody(), { ...options, address }).catch(()=>{ return  { zkapps: [] } });
    getZkAppPending = gql(networkConfig.gqlUrl, getPendingZkAppTxBody(), { ...options, address }).catch(()=>{ return { pooledZkappCommands: [] } });
  }
  const [{ pooledUserCommands }, { transactions }, { zkapps }, { pooledZkappCommands }] = await Promise.all([
    getPendingTxList,
    getTxList,
    getZkAppTxList,
    getZkAppPending,
  ]);
  const pendingZkAppTxs = formatZkAppTxList(pooledZkappCommands);
  const pendingList = [...pooledUserCommands, ...pendingZkAppTxs].sort((a, b) => b.nonce - a.nonce);
  const includedZkAppTxs = formatZkAppTxList(zkapps);
  const includedList = [...transactions, ...includedZkAppTxs].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  pendingList.forEach((tx: any) => {
    tx.memo = decodeMemo(tx.memo);
    tx.status = 'PENDING';
  });

  includedList.forEach((tx: any) => {
    tx.memo = decodeMemo(tx.memo);
    tx.status = tx.failureReason ? 'FAILED' : 'APPLIED';
  });

  return [...pendingList, ...includedList];
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

export const submitStakeDelegation = async (
  signedStakeTx: SignedLegacy<StakeDelegation>,
  networkConfig: NetworkConfig,
) => {
  const txGql = sendStakeDelegationGql(false);
  const variables = { ...signedStakeTx.data, ...signedStakeTx.signature };

  const data = await gql(networkConfig.gqlUrl, txGql, variables);
  const { hash } = data.sendDelegation.delegation
  await popupNotify(`Stake delegation ${hash.slice(0,5) + "..." + hash.slice(-5)} has been submitted`);

  return data.sendDelegation.delegation;
};

export const signZkAppTx = async (
  args: ZkAppTxInput,
  publicKey: string,
  privateKey: string,
  networkConfig: NetworkConfig,
): Promise<Signed<ZkappCommand>> => {
  if (networkConfig.name !== ENetworkName.DEVNET) {
    throw new Error('ZkApp transaction only available on Devnet');
  }
  try {
    const client = getMinaClient(networkConfig);
    const { account } = await getAccountInfo(publicKey, networkConfig);
    let decimal = new BigNumber(10).pow(networkConfig.token.decimals);
    let sendFee = new BigNumber(args.feePayer.fee).multipliedBy(decimal).toNumber();

    const payload: any = {
      zkappCommand: JSON.parse(args.transaction),
      feePayer: {
        feePayer: publicKey,
        fee: sendFee,
        nonce: account.inferredNonce,
        memo: args.feePayer.memo || '',
      },
    };
    const signedTx = client.signTransaction(payload, privateKey) as Signed<ZkappCommand>;
    return signedTx;
  } catch (error) {
    console.error('Failed to sign ZkAppTx:', error.message);
    throw error;
  }
};

export const submitZkAppTx = async (signedZkAppTx: Signed<ZkappCommand>, networkConfig: NetworkConfig) => {
  if (networkConfig.name !== ENetworkName.DEVNET) {
    throw new Error('ZkApp transaction only available on Devnet');
  }
  try {
    const txGql = getPartyBody();
    const variables = {
      zkappCommandInput: signedZkAppTx.data.zkappCommand,
    };
    const sendPartyRes = await gql(networkConfig.gqlUrl, txGql, variables);
    const { hash } = sendPartyRes.sendZkapp.zkapp
    await popupNotify(`ZkApp tx ${hash.slice(0,5) + "..." + hash.slice(-5)} has been submitted`);
    return sendPartyRes.sendZkapp.zkapp;
  } catch (error) {
    console.error('Failed to submitZkAppTx:', error.message);
    throw error;
  }
};
