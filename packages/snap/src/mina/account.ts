import { SLIP10Node } from '@metamask/key-tree';
import { Keypair } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import bs58check from 'bs58check';
import { Buffer } from 'safe-buffer';
import { ESnapMethod } from '../constants/snap-method.constant';
import { reverse } from '../util/helper';
import { getMinaClient } from '../util/mina-client.util';
import { getAccountInfoQuery } from '../graphql/gqlparams';
import { gql } from '../graphql';
import { NetworkConfig } from '../interfaces';
import { getNetworkConfig, getSnapConfiguration } from './configuration';

export const getKeyPair = async (networkConfig: NetworkConfig) => {
  const client = getMinaClient(networkConfig);
  const { coinType } = networkConfig.token;
  const bip32Node: any = await snap.request({
    method: ESnapMethod.SNAP_GET_BIP32_ENTROPY,
    params: {
      path: ['m', "44'", `${coinType}'`],
      curve: 'secp256k1',
    },
  });
  const minaSlip10Node = await SLIP10Node.fromJSON(bip32Node);
  const accountKey0 = await minaSlip10Node.derive([`bip32:${networkConfig.currentAccIndex}'`]);
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

// export const getMinaAddress = async () => {
//   const keyPair = await getKeyPair();
//   return keyPair.publicKey;
// };

export const signMessage = (
  message: string,
  keypair: Keypair,
  networkConfig: NetworkConfig,
) => {
  const client = getMinaClient(networkConfig);
  const signed = client.signMessage(message, keypair);
  if (client.verifyMessage(signed)) {
    console.log('Message was verified successfully');
    return signed;
  }
  console.log('Failed to verify message');
  return null;
};

/**
 * Get User balance and nonce.
 *
 * @param publicKey - User address.
 * @param networkConfig - Selected network config.
 * @returns `null` if get account info fail.
 */
export async function getAccountInfo(
  publicKey: string,
  networkConfig: NetworkConfig,
) {
  const query = getAccountInfoQuery;
  const variables = { publicKey };

  const { data, error } = await gql(networkConfig, query, variables);

  if (error) {
    console.error(error);
    return null;
  }
  console.log(`-account data:`, data)
  return data;
}

export const changeAccount = async (index: number) => {
  const snapConfig = await getSnapConfiguration();
  snapConfig.networks[snapConfig.currentNetwork].currentAccIndex = index;
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'update', newState: { mina: snapConfig }},
  });
  const { publicKey } = await getKeyPair(snapConfig.networks[networkIndex]);
  return { usingAddress: publicKey };
}
