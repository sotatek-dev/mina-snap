import React, { useEffect } from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';
import Home from 'components/layout/index';
import { EMinaMethod } from 'test-mina-snap/src/constants/mina-method.constant';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import { connectWallet, setIsLoading } from 'slices/walletSlice';

const HomePage = () => {
  useHasMetamaskFlask();
  const reduxDispatch = useAppDispatch();
  const { getAccountInfors, getSnap } = useMinaSnap();
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const { connected } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    const a = async () => {
      const getIsUnlocked = async () => await (window as any).ethereum._metamask.isUnlocked();
      const isUnlocked = (await getIsUnlocked()) as boolean;
      setIsUnlocked(isUnlocked);
      if (isUnlocked) {
        const isInstalledSnap = await getSnap();
        const account = await getAccountInfors();

        reduxDispatch(
          connectWallet({
            account,
            isInstalledSnap,
          }),
        );
      }
    };
    a();
  }, []);

  useEffect(() => {
    if (connected) {
      setIsUnlocked(true);
    }
  }, [connected]);

  return <div>{isUnlocked ? <Home connected></Home> : <ConnectWallet></ConnectWallet>}</div>;
};

export default HomePage;
