import { ESnapDialogType } from '../constants/snap-method.constant';
import { NetworkConfig, TxInput } from '../interfaces';
import { popupDialog, popupNotify } from '../util/popup.util';
import { getKeyPair } from './account';
import { sendPayment, signPayment } from './transaction';

export { getSnapConfiguration, changeNetwork, getNetworkConfig, resetSnapConfiguration } from './configuration';

export const sendTransaction = async (args: TxInput, networkConfig: NetworkConfig) => {
  const { publicKey, privateKey } = await getKeyPair(networkConfig);

  const confirmation = await popupDialog(
    ESnapDialogType.CONFIRMATION,
    'Confirm transaction',
    `From: ${publicKey}\nTo: ${args.to}\nAmount: ${args.amount} MINA\nFee: ${args.fee} MINA`,
  );
  if (!confirmation) {
    await popupNotify('Payment rejected');
    return null;
  }

  const signedPayment = await signPayment(args, publicKey, privateKey, networkConfig);
  if (!signedPayment) {
    await popupNotify('Sign payment error');
    return null;
  }

  const payment = await sendPayment(signedPayment, networkConfig);
  if (!payment) {
    await popupNotify('Send payment error');
    return null;
  }

  return payment;
};
