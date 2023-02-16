import { SnapProvider } from '@metamask/snap-types';
import { defaultConfiguration } from '../constants/config.constant';
import { ESnapMethod } from '../constants/snap-method.constant';

export const getConfiguration = async (wallet: SnapProvider) => {
  const state: any = await wallet.request({
    method: ESnapMethod.SNAP_MANAGE_STATE,
    params: ['get'],
  });
  if (!state?.mina.config) {
    await wallet.request({
      method: ESnapMethod.SNAP_MANAGE_STATE,
      params: ['update', { mina: { config: defaultConfiguration } }],
    });
    return state.mina.config;
  }
  return state.mina.config;
};
