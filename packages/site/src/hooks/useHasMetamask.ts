import { useAppDispatch } from './redux';
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useRef } from 'react';
import { setWalletInstalled } from 'slices/walletSlice';

export const useHasMetamask = () => {
  const firstTimeRun = useRef<any>(null);
  const dispatch = useAppDispatch()
  const detectMetamaskFlask = async () => {
    if (firstTimeRun.current) return;
    try {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: false,
        silent: true,
      })) as any | undefined;
      const isMetamask = (await provider?.request({ method: 'web3_clientVersion' }));
      if (provider && isMetamask) {
        dispatch(setWalletInstalled(true))
      } else
        dispatch(setWalletInstalled(false))
    } catch (e) {
      dispatch(setWalletInstalled(false))
    } finally {
      firstTimeRun.current = true;
    }
  };

  useEffect(() => {
    detectMetamaskFlask()
  }, []);


};
