import { SLIP10Node } from '@metamask/key-tree';
import { Keypair } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import bs58check from 'bs58check';
import Client from 'mina-signer';
import { Buffer } from 'safe-buffer';
import { reverse } from '../util/helper';

const client = new Client({ network: 'mainnet' });

export const getKeyPair = async () => {
  const bip32Node: any = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "12586'"],
      curve: 'secp256k1',
    },
  });
  const minaSlip10Node = await SLIP10Node.fromJSON(bip32Node);
  const accountKey0 = await minaSlip10Node.derive(["bip32:0'"]);
  if (accountKey0.privateKeyBytes) {
    // eslint-disable-next-line no-bitwise
    accountKey0.privateKeyBytes[0] &= 0x3f;
  }
  const childPrivateKey = reverse(accountKey0.privateKeyBytes);
  const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`;
  const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));
  const publicKey = client.derivePublicKey(privateKey);
  return {
    privateKey,
    publicKey,
  };
};

export const getMinaAddress = async () => {
  const keyPair = await getKeyPair();
  return keyPair.publicKey;
};

export const signMessage = (message: string, keypair: Keypair) => {
  const signed = client.signMessage(message, keypair);
  if (client.verifyMessage(signed)) {
    console.log('Message was verified successfully');
    return signed;
  }
  console.log('Failed to verify message');
  return null;
};
