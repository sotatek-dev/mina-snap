import { SLIP10Node } from '@metamask/key-tree';
import { Keypair } from 'mina-signer/dist/node/mina-signer/src/TSTypes';
import bs58check from 'bs58check';
import { Buffer } from 'safe-buffer';
import { ESnapDialogType, ESnapMethod } from '../constants/snap-method.constant';
import { reverse } from '../util/helper';
import { getMinaClient } from '../util/mina-client.util';
import { getAccountInfoQuery } from '../graphql/gqlparams';
import { gql } from '../graphql';
import { NetworkConfig } from '../interfaces';
import { getSnapConfiguration, updateSnapConfig } from './configuration';
import { popupDialog } from '../util/popup.util';

export const getKeyPair = async (index?: number, isImported?: boolean) => {
  const snapConfig = await getSnapConfiguration();
  const { currentNetwork, networks } = snapConfig;
  const networkConfig = networks[currentNetwork];
  const { importedAccounts, selectedImportedAccount } = networkConfig as NetworkConfig;
  if (typeof index === 'number' && !isImported) {
    const { name, address } = networkConfig.generatedAccounts[index];
    const { privateKey } = await generateKeyPair(networkConfig, index);
    return {
      name,
      publicKey: address,
      privateKey,
      isImported: false,
    };
  } else if (typeof index === 'number' && isImported) {
    const { name, address, privateKey } = importedAccounts[index];
    return {
      name,
      publicKey: address,
      privateKey,
      isImported: true,
    };
  }
  if (typeof selectedImportedAccount === 'number') {
    return {
      name: importedAccounts[selectedImportedAccount].name,
      privateKey: importedAccounts[selectedImportedAccount].privateKey,
      publicKey: importedAccounts[selectedImportedAccount].address,
      isImported: true,
    };
  }
  const keyPair = await generateKeyPair(networkConfig);
  return { name: networkConfig.generatedAccounts[networkConfig.currentAccIndex].name, ...keyPair, isImported: false };
};

export const generateKeyPair = async (networkConfig: NetworkConfig, index?: number) => {
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
  const accountIndex = index ? index : networkConfig.currentAccIndex;
  const accountKey0 = await minaSlip10Node.derive([`bip32:${accountIndex}'`]);
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

export const signMessage = (message: string, keypair: Keypair, networkConfig: NetworkConfig) => {
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
export async function getAccountInfo(publicKey: string, networkConfig: NetworkConfig) {
  const query = getAccountInfoQuery;
  const variables = { publicKey };

  const { data, error } = await gql(networkConfig.gqlUrl, query, variables);

  if (error) {
    console.error(error);
    return null;
  }
  /**return default data if the account does not have any tx */
  if (!data.account) {
    data.account = {
      balance: {
        total: '0',
      },
      nonce: '0',
      inferredNonce: '0',
      delegate: publicKey,
      publicKey,
    };
  }
  console.log(`-account data:`, data);
  return data;
}

export const changeAccount = async (index: number, isImported?: boolean) => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  const { generatedAccounts, importedAccounts } = networks[currentNetwork];
  if (isImported) {
    const account = importedAccounts[index];
    if (account) {
      snapConfig.networks[currentNetwork].selectedImportedAccount = index;
      console.log(`115:`, snapConfig);
      await updateSnapConfig(snapConfig);
      return {
        name: account.name,
        address: account.address,
      };
    } else {
      return {
        error: {
          message: 'The account index is invalid',
        },
      };
    }
  }
  const account = generatedAccounts[index];
  if (account) {
    snapConfig.networks[snapConfig.currentNetwork].currentAccIndex = index;
    snapConfig.networks[currentNetwork].selectedImportedAccount = null;
    await updateSnapConfig(snapConfig);
    return account;
  } else {
    return {
      error: {
        message: 'The account index is invalid',
      },
    };
  }
};

export const createAccount = async (name: string, index?: number) => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  let newAccountIndex;
  if (index) {
    newAccountIndex = index;
  } else {
    const { generatedAccounts } = networks[currentNetwork];
    if (Object.keys(generatedAccounts).length) {
      const currentMaxIndex = Math.max(...Object.keys(generatedAccounts).map((key) => Number(key)));
      newAccountIndex = currentMaxIndex + 1;
    } else {
      newAccountIndex = 0;
    }
  }
  snapConfig.networks[currentNetwork].currentAccIndex = newAccountIndex;
  snapConfig.networks[currentNetwork].selectedImportedAccount = null;
  const { publicKey } = await generateKeyPair(networks[currentNetwork], newAccountIndex);
  snapConfig.networks[currentNetwork].generatedAccounts[newAccountIndex] = { name, address: publicKey };
  await updateSnapConfig(snapConfig);
  return { name, address: publicKey };
};

export const importAccount = async (name: string, privateKey: string) => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  const { importedAccounts, generatedAccounts } = networks[currentNetwork];
  const client = getMinaClient(snapConfig.networks[snapConfig.currentNetwork]);
  const existingAddresses = [
    ...Object.values(generatedAccounts).map((account) => account.address),
    ...Object.values(importedAccounts).map((account) => account.address),
  ];

  // Validate for incorrect private key
  let publicKey: string;
  try {
    publicKey = client.derivePublicKey(privateKey);
  } catch (err) {
    return {
      error: {
        message: 'The account index is invalid',
      },
    };
  }

  // Check for duplicate account
  const duplicateAddress = existingAddresses.find((address) => address === publicKey);
  if (duplicateAddress) {
    return {
      error: {
        message: 'Incorrect Private Key',
      },
    };
  }

  let newAccountIndex;
  if (Object.keys(importedAccounts).length) {
    const currentMaxIndex = Math.max(...Object.keys(importedAccounts).map((key) => Number(key)));
    newAccountIndex = currentMaxIndex + 1;
  } else {
    newAccountIndex = 0;
  }
  snapConfig.networks[currentNetwork].selectedImportedAccount = newAccountIndex;
  snapConfig.networks[currentNetwork].importedAccounts[newAccountIndex] = {
    name,
    address: publicKey,
    privateKey,
  };
  await updateSnapConfig(snapConfig);
  return { name, address: publicKey };
};

export const getAccounts = async () => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  const { generatedAccounts, importedAccounts } = networks[currentNetwork];
  const generatedAccountsArr =
    Object.keys(generatedAccounts).length > 0
      ? Object.entries(generatedAccounts).map(([index, account]) => {
          return {
            ...account,
            index,
            isImported: false,
          } as any;
        })
      : [];
  const importedAccountsArr =
    Object.keys(importedAccounts).length > 0
      ? Object.entries(importedAccounts).map(([index, account]) => {
          const { name, address } = account;
          return {
            name,
            address,
            index,
            isImported: true,
          } as any;
        })
      : [];
  const allAccounts = [...generatedAccountsArr, ...importedAccountsArr];
  await Promise.all(
    allAccounts.map((account) => {
      return getAccountInfo(account.address, networks[currentNetwork]).then((data) => {
        account.balance = data.account.balance;
      });
    }),
  );
  return allAccounts;
};

export const editAccountName = async (index: number, name: string, isImported?: boolean) => {
  const snapConfig = await getSnapConfiguration();
  const { networks, currentNetwork } = snapConfig;
  const account = isImported
    ? networks[currentNetwork].importedAccounts[index]
    : networks[currentNetwork].generatedAccounts[index];
  if (!account) {
    return {
      error: {
        message: 'The account does not exist',
      },
    };
  }
  account.name = name;
  await updateSnapConfig(snapConfig);
  return {
    name: account.name,
    address: account.address,
  };
};
