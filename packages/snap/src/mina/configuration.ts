import {
  ENetworkName,
  defaultSnapConfig,
} from '../constants/config.constant';
import { ESnapMethod } from '../constants/snap-method.constant';
import { NetworkConfig, SnapConfig, SnapState } from '../interfaces';

export const getSnapConfiguration = async (): Promise<SnapConfig> => {
  const state = (await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'get' },
  })) as SnapState;
  if (!state?.mina ||Object.keys(state.mina).length != 2) {
    await updateSnapConfig(defaultSnapConfig)
    const newState = (await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'get' },
    })) as SnapState;
    return newState.mina;
  }
  return state.mina;
};

export const getNetworkConfig = async (): Promise<NetworkConfig> => {
  const snapConfig = await getSnapConfiguration();
  const networkConfig = snapConfig.networks[snapConfig.currentNetwork];
  return networkConfig;
}

export const changeNetwork = async (networkName: ENetworkName): Promise<NetworkConfig> => {
  let snapConfig = await getSnapConfiguration();
  if (networkName != snapConfig.currentNetwork && snapConfig.networks[networkName]) {
    snapConfig.currentNetwork = networkName;
    await updateSnapConfig(snapConfig)
  }
  const networkConfig = await getNetworkConfig();
  return networkConfig;
};

/**Clear state and reset to default network */
export const resetSnapConfiguration = async (): Promise<NetworkConfig> => {
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'clear' },
  });
  const networkConfig = await getNetworkConfig();
  return networkConfig;
};

export const updateSnapConfig = async (snapConfig: SnapConfig) => {
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'update', newState: { mina: snapConfig } },
  });
}
