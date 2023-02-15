import BigNumber from 'bignumber.js';
import { Payment, Signed } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import { cointypes } from '../constants/config.constant';
import { gql } from '../graphql';
import { sendPaymentQuery } from '../graphql/gqlparams';
import { TrxInput } from '../types/transaction.type';
import { getMinaClient } from '../util/mina-client.util';
import { getAccountInfo } from './account';

const client = getMinaClient();

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
 * @returns `null` if sign payment failed, else return signed payment.
 */
export async function signPayment(
  args: TrxInput,
  publicKey: string,
  privateKey: string,
) {
  const { amount, fee, to, memo, validUntil } = args;
  const { account } = await getAccountInfo(publicKey);

  try {
    const decimal = new BigNumber(10).pow(cointypes.decimals);
    const sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
    const sendAmount = new BigNumber(amount).multipliedBy(decimal).toNumber();

    const payment = {
      from: publicKey,
      to,
      amount: sendAmount,
      fee: sendFee,
      nonce: account.inferredNonce,
      memo,
      validUntil,
    };
    return client.signPayment(payment, privateKey);
  } catch (err) {
    console.error('sign', err.message); // TODO - remove
    return null;
  }
}

/**
 * Send payment.
 *
 * @param signedPayment - Signed payment.
 * @returns `null` if error.
 */
export async function sendPayment(signedPayment: Signed<Payment>) {
  const query = sendPaymentQuery(false);
  const variables = { ...signedPayment.data, ...signedPayment.signature };

  const { data, error } = await gql(query, variables);

  if (error) {
    console.error('send', error); // TODO - remove
    return null;
  }

  return data;
}

// export const signPayment = async (to: string, amount: string, fee: string) => {
//   const keyPair = await getKeyPair();
//   const signedPayment = client.signPayment(
//     {
//       to,
//       from: keyPair.publicKey,
//       amount,
//       fee,
//       nonce: 0,
//     },
//     keyPair.privateKey,
//   );
//   if (client.verifyPayment(signedPayment)) {
//     console.log('Payment was verified successfully:', signedPayment.signature);
//   }
// };
