import { TrxInput } from '../types/transaction.type';
import { popupConfirm, popupNotify } from '../util/popup.util';
import { getKeyPair } from './account';
import { sendPayment, signPayment } from './transaction';

export class APIService {
  hello() {
    return 'Hello World';
  }

  async sendTransaction(args: TrxInput) {
    const { publicKey, privateKey } = await getKeyPair();

    const confirmation = await popupConfirm(
      'Confirm transaction',
      '',
      `From: ${publicKey}\nTo: ${args.to}\nAmount: ${args.amount} Mina\nFee: ${args.fee} Mina`,
    );
    if (!confirmation) {
      popupNotify('Payment rejected');
      return null;
    }

    const signedPayment = await signPayment(args, publicKey, privateKey);
    if (!signedPayment) {
      popupNotify('Sign payment error');
      return null;
    }

    console.log('30 ---', signedPayment);

    const payment = await sendPayment(signedPayment);
    if (!payment) {
      popupNotify('Send payment error');
      return null;
    }

    return payment;
  }
}
