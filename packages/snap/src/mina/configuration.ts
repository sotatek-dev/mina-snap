import { SnapProvider } from '@metamask/snap-types';
import {
  ENetworkName,
  defaultSnapConfig,
} from '../constants/config.constant';
import { ESnapMethod } from '../constants/snap-method.constant';
import { NetworkConfig, SnapConfig, SnapState } from '../interfaces';

export const getSnapConfiguration = async (snap: SnapProvider): Promise<SnapConfig> => {
  const state = (await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'get' },
  })) as SnapState;
  if (!state?.mina) {
    await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'update', newState: { mina: defaultSnapConfig } },
    });
    const newState = (await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'get' },
    })) as SnapState;
    return newState.mina;
  }
  return state.mina;
};

export const getNetworkConfig = async (snap: SnapProvider): Promise<NetworkConfig> => {
  const snapConfig = await getSnapConfiguration(snap);
  const networkConfig = snapConfig.networks.find(network => network.isSelected);
  return networkConfig as NetworkConfig;
}

export const changeNetwork = async (snap: SnapProvider, networkName: ENetworkName): Promise<NetworkConfig> => {
  let snapConfig = await getSnapConfiguration(snap);
  const selectingNetworkIndex = snapConfig.networks.findIndex(network => network.isSelected);
  const newNetworkIndex = snapConfig.networks.findIndex(network => network.name === networkName);
  if (selectingNetworkIndex && newNetworkIndex && selectingNetworkIndex != newNetworkIndex) {
    snapConfig.networks[selectingNetworkIndex].isSelected = false;
    snapConfig.networks[newNetworkIndex].isSelected = true;
    await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'update', newState: { mina: snapConfig } },
    });
  }
  const networkConfig = await getNetworkConfig(snap);
  return networkConfig;
};

/**Clear state and reset to default network */
export const resetSnapConfiguration = async (snap: SnapProvider): Promise<SnapConfig> => {
  await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'clear' },
  });

  return getSnapConfiguration(snap);
};
