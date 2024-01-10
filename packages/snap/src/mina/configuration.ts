import { ENetworkName, defaultSnapConfig, networksConstant } from '../constants/config.constant';
import { ESnapMethod } from '../constants/snap-method.constant';
import { NetworkConfig, SnapConfig, SnapState } from '../interfaces';
import { popupNotify } from '../util/popup.util';

export const getSnapConfiguration = async (): Promise<SnapConfig> => {
  const state = (await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'get' },
  })) as SnapState;
  if (!state?.mina) {
    await updateSnapConfig(defaultSnapConfig);
    const newState = (await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'get' },
    })) as SnapState;
    return newState.mina;
  }
  /**Update the networks state if there are any changes */
  let needToUpdate = false;
  let newNetworksConfig = state.mina.networks;
  for (const networkKey in defaultSnapConfig.networks) {
    if (state.mina.networks[networkKey]) {
      const {
        gqlUrl: oldGqlUrl,
        gqlTxUrl: oldGqlTxUrl,
        explorerUrl: oldExplorerUrl,
        token: oldToken,
      } = state.mina.networks[networkKey];
      const {
        gqlUrl: defaultGqlUrl,
        gqlTxUrl: defaultGqlTxUrl,
        explorerUrl: defaultExplorerUrl,
        token: defaultToken,
      } = defaultSnapConfig.networks[networkKey];
      if (
        oldGqlUrl !== defaultGqlUrl ||
        oldGqlTxUrl !== defaultGqlTxUrl ||
        oldExplorerUrl !== defaultExplorerUrl ||
        JSON.stringify(oldToken) !== JSON.stringify(defaultToken)
      ) {
        newNetworksConfig[networkKey] = {
          name: defaultSnapConfig.networks[networkKey].name,
          // Replace new url configs
          gqlUrl: defaultSnapConfig.networks[networkKey].gqlUrl,
          gqlTxUrl: defaultSnapConfig.networks[networkKey].gqlTxUrl,
          explorerUrl: defaultSnapConfig.networks[networkKey].explorerUrl,
          token: defaultSnapConfig.networks[networkKey].token,
          // Keep old configs related to account
          currentAccIndex: state.mina.networks[networkKey].currentAccIndex,
          generatedAccounts: state.mina.networks[networkKey].generatedAccounts,
          selectedImportedAccount: state.mina.networks[networkKey].selectedImportedAccount,
          importedAccounts: state.mina.networks[networkKey].importedAccounts,
        };
        needToUpdate = true;
      } else {
        newNetworksConfig[networkKey] = state.mina.networks[networkKey];
      }
    } else {
      newNetworksConfig[networkKey] = defaultSnapConfig.networks[networkKey];
      needToUpdate = true;
    }
  }
  if (needToUpdate) {
    state.mina.networks = newNetworksConfig
    console.log("Networks configs are updated!");
    await updateSnapConfig(state.mina);
  }
  return state.mina;
};

export const getNetworkConfig = async (snapConfig: SnapConfig): Promise<NetworkConfig> => {
  const { networks, currentNetwork } = snapConfig;
  const networkConfig = networks[currentNetwork];
  /**update explorer to network if the user is using snap below version 0.1.23 */
  if (!networkConfig.explorerUrl) {
    snapConfig.networks[currentNetwork].explorerUrl = networksConstant[currentNetwork].explorerUrl;
    await updateSnapConfig(snapConfig);
  }
  return networkConfig;
};

export const changeNetwork = async (networkName: ENetworkName): Promise<NetworkConfig | null> => {
  let snapConfig = await getSnapConfiguration();
  if (!snapConfig.networks[networkName]) {
    const errorMsg = `Invalid network. Cannot change the network.`;
    await popupNotify(errorMsg);
    throw new Error(errorMsg);
  }
  if (networkName != snapConfig.currentNetwork && snapConfig.networks[networkName]) {
    snapConfig.currentNetwork = networkName;
    await updateSnapConfig(snapConfig);
  }
  const networkConfig = await getNetworkConfig(snapConfig);
  return networkConfig;
};

/**Clear state and reset to default network */
export const resetSnapConfiguration = async (): Promise<NetworkConfig> => {
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'clear' },
  });
  const snapConfig = await getSnapConfiguration();
  const networkConfig = await getNetworkConfig(snapConfig);
  return networkConfig;
};

export const updateSnapConfig = async (snapConfig: SnapConfig) => {
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'update', newState: { mina: snapConfig } },
  });
};
