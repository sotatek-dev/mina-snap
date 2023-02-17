import { SnapProvider } from '@metamask/snap-types';
import { defaultConfiguration } from '../constants/config.constant';
import { ESnapMethod } from '../constants/snap-method.constant';

export const getConfiguration = async (snap: SnapProvider) => {
  const state: any = await snap.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: { operation: 'get' },
  });
  console.log(`-10:`, state)
  if (!state?.mina.config) {
    await snap.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: { operation: 'update', newState: { mina: { config: defaultConfiguration } }},
    });
    return state.mina.config;
  }
  return state.mina.config;
};
