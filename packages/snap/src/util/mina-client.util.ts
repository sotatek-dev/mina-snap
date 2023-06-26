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
      return new Client({ network: 'testnet' });
    default:
      popupNotify("Cannot find the corresponding network type")
      break
  }
};
