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
} from 'slices/walletSlice';
import { ethers } from 'ethers';
import { getLatestSnapVersion } from 'utils/utils';
import { setNetworks } from 'slices/networkSlice';

const HomePage = () => {
  useHasMetamaskFlask();
  const reduxDispatch = useAppDispatch();
  const { getSnap, connectToSnap, AccountList, getAccountInfors, GetNetworkConfigSnap, getTxHistory } = useMinaSnap();
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const { connected } = useAppSelector((state) => state.wallet);
  

  useEffect(() => {
    const a = async () => {
      const getIsUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
      const isUnlocked = (await getIsUnlocked()) as boolean;
      setIsUnlocked(isUnlocked);
      localStorage.clear();

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
            setIsUnlocked(true);
            await reduxDispatch(setIsLoadingGlobal(false));
            await reduxDispatch(setWalletConnection(true));
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
      onBlur();
      // Specify how to clean up after this effect:
      return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      };
    }
    WindowFocusHandler();
  }, [])

  useEffect(() => {
    if (connected) {
      setIsUnlocked(true);
    }
  }, [connected]);

  const onFocus = async () => {
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
  };
  const onBlur = async () => {

  };

  return <div>{isUnlocked ? <Home /> : <ConnectWallet />}</div>;
};

export default HomePage;
