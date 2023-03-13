import { ESnapDialogType } from '../constants/snap-method.constant';
import { NetworkConfig, StakeTxInput, TxInput } from '../interfaces';
import { popupDialog, popupNotify } from '../util/popup.util';
import { getKeyPair } from './account';
import { submitPayment, submitStakeDelegation, signPayment, signStakePayment } from './transaction';

export { getSnapConfiguration, changeNetwork, getNetworkConfig, resetSnapConfiguration } from './configuration';

export const sendPayment = async (args: TxInput, networkConfig: NetworkConfig) => {
  const { publicKey, privateKey } = await getKeyPair();

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

  const payment = await submitPayment(signedPayment, networkConfig);
  if (!payment) {
    await popupNotify('Submit payment error');
    return null;
  }

  return payment;
};

export const sendStakeDelegation = async (args: StakeTxInput, networkConfig: NetworkConfig) => {
  const { publicKey, privateKey } = await getKeyPair();

  const confirmation = await popupDialog(
    ESnapDialogType.CONFIRMATION,
    'Confirm transaction',
    `Block producer address: ${args.to}\nFrom: ${publicKey}\nFee: ${args.fee} MINA`,
  );
  if (!confirmation) {
    await popupNotify('Transaction rejected');
    return null;
  }

  const signedStakeTx = await signStakePayment(args, publicKey, privateKey, networkConfig);
  if (!signedStakeTx) {
    await popupNotify('Sign stake transaction error');
    return null;
  }

  const stakeTx = await submitStakeDelegation(signedStakeTx, networkConfig);
  if (!stakeTx) {
    await popupNotify('Submit stake tx error');
    return null;
  }

  return stakeTx;
}
