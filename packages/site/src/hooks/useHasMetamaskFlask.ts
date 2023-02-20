import { useAppDispatch } from './redux';
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect } from 'react';
import { setWalletInstalled } from 'slices/walletSlice';

export const useHasMetamaskFlask = () => {
  const dispatch = useAppDispatch()
  const detectMetamaskFlask = async () => {
    try {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: false,
        silent: true,
      })) as any | undefined;
      const isFlask = (await provider?.request({ method: 'web3_clientVersion' }))?.includes('flask');
      if (provider && isFlask) {

        dispatch(setWalletInstalled(true))
        return;
      }
      dispatch(setWalletInstalled(false))
    } catch (e) {
      dispatch(setWalletInstalled(false))

    }
  };

  useEffect(() => {
    detectMetamaskFlask()
  }, []);


};
