import Client from 'mina-signer';
import { cointypes } from '../constants/config.constant';

/**
 * Get MINA Client.
 *
 * @returns `Client`.
 */
export function getMinaClient() {
  if (!cointypes.network) {
    return new Client({ network: 'testnet' });
  }
  return new Client({ network: cointypes.network });
}
