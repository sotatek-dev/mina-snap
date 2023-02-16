import { NetworkConfig, TxInput } from '../interfaces';
import { popupConfirm, popupNotify } from '../util/popup.util';
import { getKeyPair } from './account';
import { sendPayment, signPayment } from './transaction';

export { getConfiguration } from './configuration';

export const sendTransaction = async (
  args: TxInput,
  networkConfig: NetworkConfig,
) => {
  const { publicKey, privateKey } = await getKeyPair(networkConfig);

  const confirmation = await popupConfirm(
    'Confirm transaction',
    '',
    `From: ${publicKey}\nTo: ${args.to}\nAmount: ${args.amount} Mina\nFee: ${args.fee} Mina`,
  );
  if (!confirmation) {
    popupNotify('Payment rejected');
    return null;
  }

  const signedPayment = await signPayment(
    args,
    publicKey,
    privateKey,
    networkConfig,
  );
  if (!signedPayment) {
    popupNotify('Sign payment error');
    return null;
  }

  const payment = await sendPayment(signedPayment, networkConfig);
  if (!payment) {
    popupNotify('Send payment error');
    return null;
  }

  return payment;
};
