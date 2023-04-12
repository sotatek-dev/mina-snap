import React, { useEffect } from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';
import Home from 'components/layout/index';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import {
  setIsLoading,
  setActiveAccount,
  setWalletConnection,
  setTransactions,
  setListAccounts,
  setIsLoadingGlobal,
  setWalletInstalled,
  setUnlockWallet,
} from 'slices/walletSlice';
import { ethers } from 'ethers';
import { getLatestSnapVersion } from 'utils/utils';
import { setNetworks } from 'slices/networkSlice';
import detectEthereumProvider from '@metamask/detect-provider';

const HomePage = () => {
  useHasMetamaskFlask();
  const reduxDispatch = useAppDispatch();
  const { getSnap, connectToSnap, AccountList, getAccountInfors, GetNetworkConfigSnap, getTxHistory } = useMinaSnap();
  const [isUnlocked, setIsUnlocked] = React.useState<any>(null);
  const { connected, isUnlock } = useAppSelector((state) => state.wallet);
  

  useEffect(() => {
    reduxDispatch(setUnlockWallet(true));
    const a = async () => {
      try {
        const getIsUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
        const isUnlocked = (await getIsUnlocked()) as boolean;
        setIsUnlocked(isUnlocked);
      } catch (error) {
        reduxDispatch(setWalletInstalled(false));
      }
      localStorage.clear();
      let i =0;
      while (i<3) {
        const provider = (await detectEthereumProvider({
          mustBeMetaMask: false,
          silent: true,
        })) as any | undefined;
        const isFlask = (await provider?.request({ method: 'web3_clientVersion' }))?.includes('flask');
        if(!isFlask){
          setIsUnlocked(false);
          reduxDispatch(setWalletInstalled(false));
        }
        i++
      }

      if (isUnlocked) {
        await reduxDispatch(setIsLoadingGlobal(true));
        await reduxDispatch(setIsLoading(false));
        const isInstalledSnap = await getSnap();
        const version = await getLatestSnapVersion();

        if (
          isInstalledSnap[process.env.REACT_APP_SNAP_ID as string] &&
          isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]?.version !== version
        ) {
          setIsUnlocked(false);
          try {
            await connectToSnap();
            await reduxDispatch(setWalletConnection(true));
          } catch (error) {
            setIsUnlocked(false);
            await reduxDispatch(setIsLoadingGlobal(false));
            await reduxDispatch(setWalletConnection(false));
          }
        } else {
          setIsUnlocked(true);
        }

        if (!isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]) {
          setIsUnlocked(false);
          return;
        }
        reduxDispatch(setIsLoadingGlobal(false));
      } else {
        await reduxDispatch(setIsLoadingGlobal(false));
        await reduxDispatch(setWalletConnection(false));
      }
    };
    a();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const WindowFocusHandler = () => {
      window.addEventListener("focus", onFocus); 
      window.addEventListener("blur", onBlur);
      // Calls onFocus when the window first loads
      onFocus();
      // Specify how to clean up after this effect:
      return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      };
    }
    WindowFocusHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (connected) {
      setIsUnlocked(true);
    }
  }, [connected]);

  const onFocus = async () => {
    const getIsUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
    const unlock = (await getIsUnlocked()) as boolean;
    const isInstalledSnap = await getSnap();
    if (unlock && isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]?.enabled){
      const network = await GetNetworkConfigSnap();
      const txList = await getTxHistory();
      const accountList = await AccountList();
      const accountInfor = await getAccountInfors();
      reduxDispatch(setNetworks(network));
      reduxDispatch(setTransactions(txList));
      reduxDispatch(setListAccounts(accountList));
      reduxDispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey as string,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
          accountName: accountInfor.name as string,
          inferredNonce: accountInfor.inferredNonce,
        }),
      );
    }else {
      setIsUnlocked(false)
    }
  };
  const onBlur = async () => {

  };

  if(isUnlocked == null) return (<>
    </>)

  return <div>{(isUnlocked && isUnlock) ? <Home /> : <ConnectWallet />}</div>;
};

export default HomePage;
