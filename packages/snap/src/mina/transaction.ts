import BigNumber from 'bignumber.js';
import { Payment, Signed } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import { gql } from '../graphql';
import { getHistoryQuery, getPaymentQuery, sendPaymentQuery } from '../graphql/gqlparams';
import { HistoryOptions, NetworkConfig, TxInput } from '../interfaces';
import { getMinaClient } from '../util/mina-client.util';
import { getAccountInfo } from './account';

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
    console.error('sign', err.message); // TODO - remove
    return null;
  }
};

/**
 * Send payment.
 *
 * @param signedPayment - Signed payment.
 * @param networkConfig - Selected network config.
 * @returns `null` if error.
 */
export async function sendPayment(signedPayment: Signed<Payment>, networkConfig: NetworkConfig) {
  const query = sendPaymentQuery(false);
  const variables = { ...signedPayment.data, ...signedPayment.signature };

  const { data, error } = await gql(networkConfig.gqlUrl, query, variables);

  if (error) {
    console.error('send', error); // TODO - remove
    return null;
  }

  return data;
}

export async function getHistory(networkConfig: NetworkConfig, options: HistoryOptions, address: string) {
  const query = getHistoryQuery;
  const variables = { ...options, address };

  const { data, error } = await gql(networkConfig.gqlTxUrl, query, variables);

  if (error) {
    console.error('send', error); // TODO - remove
    return null;
  }

  return data;
}

export async function getPayment(networkConfig: NetworkConfig, hash: string) {
  const query = getPaymentQuery;
  const variables = { hash };

  const { data, error } = await gql(networkConfig.gqlTxUrl, query, variables);

  if (error) {
    console.error('send', error); // TODO - remove
    return null;
  }

  return data;
}
