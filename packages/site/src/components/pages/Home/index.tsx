import React, { useEffect } from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';
import Home from 'components/layout/index';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import {
  connectWallet,
  setIsLoading,
  setActiveAccount,
  setWalletConnection,
  setTransactions,
  setListAccounts,
  setIsLoadingGlobal,
} from 'slices/walletSlice';
import { ethers } from 'ethers';
import { getLatestSnapVersion } from 'utils/utils';

const HomePage = () => {
  useHasMetamaskFlask();
  const reduxDispatch = useAppDispatch();
  const { getSnap, connectToSnap, AccountList, getAccountInfors, RequestSnap, SwitchNetwork } = useMinaSnap();
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const { connected } = useAppSelector((state) => state.wallet);
  
  useEffect(() => {
    const a = async () => {
      await reduxDispatch(setTransactions([]));
      await reduxDispatch(setListAccounts([]));
      await reduxDispatch(
        setActiveAccount({
          activeAccount: '',
          balance: '',
          accountName: '',
          inferredNonce: '',
        }),
      );

      const getIsUnlocked = async () => await (window as any).ethereum._metamask?.isUnlocked();
      const isUnlocked = (await getIsUnlocked()) as boolean;
      setIsUnlocked(isUnlocked);
      localStorage.clear();
      
      if (isUnlocked) {
        await reduxDispatch(setIsLoadingGlobal(true));
        await reduxDispatch(setIsLoading(false));
        const isInstalledSnap = await getSnap();
        const version = await getLatestSnapVersion();

        if(isInstalledSnap[process.env.REACT_APP_SNAP_ID as string] && isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]?.version !== version){
            setIsUnlocked(false)
            try {
              await connectToSnap();
              await reduxDispatch(setWalletConnection(true));
            } catch (error) {
              setIsUnlocked(true);
              await reduxDispatch(setIsLoadingGlobal(false));
              await reduxDispatch(setWalletConnection(true));
            }
          }else {
          setIsUnlocked(true)
        }
        
        if (!isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]) {
          setIsUnlocked(false);
          return;
        }
        await SwitchNetwork('Mainnet').then(async () => {
          await setTimeout(async () => {
            if (!isInstalledSnap[process.env.REACT_APP_SNAP_ID as string]) {
              await RequestSnap();
            }
            const accountList = await AccountList();
            const accountInfor = await getAccountInfors();
            await reduxDispatch(
              connectWallet({
                accountList,
                isInstalledSnap,
              }),
            );
            await reduxDispatch(
              setActiveAccount({
                activeAccount: accountInfor.publicKey as string,
                balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
                accountName: accountInfor.name as string,
                inferredNonce: accountInfor.inferredNonce,
              }),
            );
            await reduxDispatch(setIsLoadingGlobal(false));
          }, 300);
        });
      } else {
        await reduxDispatch(setIsLoadingGlobal(false));
        await reduxDispatch(setWalletConnection(false));
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
