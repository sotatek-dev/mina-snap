import React, { useEffect } from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';
import Home from 'components/layout/index';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import { connectWallet, setIsLoading, setActiveAccount, setWalletConnection } from 'slices/walletSlice';
import { ethers } from 'ethers';

const HomePage = () => {
  useHasMetamaskFlask();
  const reduxDispatch = useAppDispatch();
  const { getSnap, AccountList, getAccountInfors, RequestSnap } = useMinaSnap();
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const { connected } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    reduxDispatch(setIsLoading(false));
    const a = async () => {
      const getIsUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
      const isUnlocked = (await getIsUnlocked()) as boolean;
      setIsUnlocked(isUnlocked);
      const isInstalledSnap = await getSnap();

      if (!isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]) {
        setIsUnlocked(false);
        return;
      }

      if (isUnlocked) {
        if (!isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]) {
          await RequestSnap();
        }
        const accountList = await AccountList();
        const accountInfor = await getAccountInfors();
        reduxDispatch(
          connectWallet({
            accountList,
            isInstalledSnap,
          }),
        );
        console.log(ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string);
        reduxDispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey as string,
            balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
            accountName: accountInfor.name as string,
          }),
        );
      } else {
        reduxDispatch(setWalletConnection(false));
      }
    };
    a();
  }, []);

  useEffect(() => {
    if (connected) {
      setIsUnlocked(true);
    }
  }, [connected]);

  return <div>{isUnlocked ? <Home></Home> : <ConnectWallet></ConnectWallet>}</div>;
};

export default HomePage;
