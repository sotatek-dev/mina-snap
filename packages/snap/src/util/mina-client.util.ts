import Client from 'mina-signer';
import { ENetworkName } from '../constants/config.constant';
import { NetworkConfig } from '../interfaces';

export const getMinaClient = (networkConfig: NetworkConfig) => {
  if (networkConfig.name === ENetworkName.MAINNET) {
    return new Client({ network: 'mainnet' });
  }
  return new Client({ network: 'testnet' });
};
