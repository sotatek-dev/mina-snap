import Client from 'mina-signer';
import { ENetworkName } from '../constants/config.constant';
import { NetworkConfig } from '../interfaces';
import { popupNotify } from './popup.util';

export const getMinaClient = (networkConfig: NetworkConfig) => {
  switch(networkConfig.name) {
    case ENetworkName.MAINNET:
      return new Client({ network: 'mainnet' });
    case ENetworkName.BERKELEY:
    case ENetworkName.DEVNET:
    case ENetworkName.TESTWORLD:
      return new Client({ network: 'testnet' });
    default:
      const errorMsg = "Cannot find the corresponding network type"
      throw new Error(errorMsg)
  }
};
