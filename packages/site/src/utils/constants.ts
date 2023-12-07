import success from 'assets/images/success.png';
import pending from 'assets/images/pending.png'
import fail from 'assets/images/fail.png'


export const DECIMALS_DISPLAYED_MAX_LENGTH = 11;

export const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export const MINA_MAINNET_EXPLORER = 'https://minaexplorer.com/';

export const MINA_TESTNET_EXPLORER = 'https://devnet.minaexplorer.com/';

export const MINA_BERKELEY_EXPLORER = 'https://berkeley.minaexplorer.com/';

export const SNAPS_DOC_URL = 'https://docs.metamask.io/guide/snaps.html';

export const MINA_ADDRESS_LENGTH = 55;

export const ASSETS_PRICE_REFRESH_FREQUENCY = 120000;

export const INPUT_MAX_LENGTH = 100;

export const POPOVER_DURATION = 3000;

export const TRANSACTIONS_REFRESH_FREQUENCY = 60000;

export const TOKEN_BALANCE_REFRESH_FREQUENCY = 60000;

export const TIMEOUT_DURATION = 10000;

export const OPTIONS_NETWORK = ['Mainnet', 'Devnet', 'Berkeley', 'Testworld'];

export const GAS_FEE = {
  slow: 0.0011,
  default: 0.0101,
  fast: 0.201
}

export const TRANSACTION_STATUS = {
  Success: success,
  Pending: pending,
  Fail: fail
}

export enum ENetworkName {
  MAINNET = 'Mainnet',
  DEVNET = 'Devnet',
  BERKELEY = 'Berkeley'
}
