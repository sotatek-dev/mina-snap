import Client from 'mina-signer';
import { getKeyPair } from './account';

const client = new Client({ network: 'mainnet' });

export const signPayment = async (to: string, amount: string, fee: string) => {
  const keyPair = await getKeyPair();
  const signedPayment = client.signPayment(
    {
      to,
      from: keyPair.publicKey,
      amount,
      fee,
      nonce: 0,
    },
    keyPair.privateKey,
  );
  if (client.verifyPayment(signedPayment)) {
    console.log('Payment was verified successfully:', signedPayment.signature);
  }
};
