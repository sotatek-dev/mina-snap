import Button from 'components/common/button';
import React, { useContext, useEffect } from 'react';
import logoMina from 'assets/logo/logo-mina.svg';
import { useMinaSnap } from 'services/useMinaSnap';
import { Box, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { connectWallet, setActiveAccount, setIsLoading } from 'slices/walletSlice';
import { ethers } from 'ethers';

const BoxCenter = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

const BoxContent = styled(Box)(() => ({
  maxWidth: '430px',
  margin: 'auto',
}));

const BoxInsideMetamask = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  fontStyle: 'italic',
  fontWeight: '400',
  fontSize: '18px',
  lineHeight: '22px',
  paddingTop: '25px',
  paddingBottom: '25px',
  color: '#000000',
}));

type Props = {};

const ConnectWallet: React.FC<Props> = () => {
  const reduxDispatch = useAppDispatch();
  const { connectToSnap, getSnap, AccountList, getAccountInfors } = useMinaSnap();

  const { isInstalledWallet, isLoading } = useAppSelector((state) => state.wallet);

  const handleConnectClick = async () => {
    if (isLoading) return;
    try {
      reduxDispatch(setIsLoading(true));
      await connectToSnap();
      const isInstalledSnap = await getSnap();
      const accountList = await AccountList();
      const accountInfor = await getAccountInfors();
      reduxDispatch(setIsLoading(false));

      reduxDispatch(
        connectWallet({
          accountList,
          isInstalledSnap,
        }),
      );
      reduxDispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey as string,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
          accountName: accountInfor.name as string,
        }),
      );
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <BoxContent>
        <BoxCenter>
          <img src={logoMina} />
        </BoxCenter>
        <BoxCenter>
          <BoxInsideMetamask>Mina Snaps enable Mina network inside Metamask</BoxInsideMetamask>
        </BoxCenter>

        <BoxCenter sx={{ paddingBottom: '25px' }}>
          {!isInstalledWallet && <Button>Metamask Flask is required to run snap!</Button>}
        </BoxCenter>
        <BoxCenter>
          <Button onClick={handleConnectClick}>{isLoading ? <>CONNECTING</> : 'CONNECT TO METAMASK'}</Button>
        </BoxCenter>
      </BoxContent>
    </>
  );
};

export default ConnectWallet;
