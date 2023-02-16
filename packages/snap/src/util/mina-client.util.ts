import Client from 'mina-signer';
import { NetworkConfig } from '../interfaces';

export const getMinaClient = (networkConfig: NetworkConfig) => {
  if (networkConfig.network === 'mainnet') {
    return new Client({ network: 'mainnet' });
  }
  return new Client({ network: 'testnet' });
};
