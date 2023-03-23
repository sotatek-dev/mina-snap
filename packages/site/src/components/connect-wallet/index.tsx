import Button from 'components/common/button';
import React from 'react';
import logoMina from 'assets/logo/logo-mina.svg';
import { useMinaSnap } from 'services/useMinaSnap';
import { Box, ButtonProps, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { connectWallet, setActiveAccount, setIsLoading, setIsLoadingGlobal, setTransactions } from 'slices/walletSlice';
import { ethers } from 'ethers';
import wainning from 'assets/icons/wainning.svg';

type Props = {};

const ConnectWallet: React.FC<Props> = () => {
  const reduxDispatch = useAppDispatch();
  const { connectToSnap, getSnap, AccountList, getAccountInfors, getTxHistory, SwitchNetwork } = useMinaSnap();

  const { isInstalledWallet, isLoading } = useAppSelector((state) => state.wallet);

  const handleConnectClick = async () => {
    if (isLoading) return;
    try {
      reduxDispatch(setIsLoading(true));
      await connectToSnap();
      const isInstalledSnap = await getSnap();
      await SwitchNetwork('Mainnet');
      const accountList = await AccountList();
      const accountInfor = await getAccountInfors();
      const txList = await getTxHistory();
      reduxDispatch(setTransactions(txList));
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
          inferredNonce: accountInfor.inferredNonce as string,
        }),
      );
      reduxDispatch(setIsLoadingGlobal(false));
    } catch (e) {
      reduxDispatch(setIsLoadingGlobal(false));
    } finally {
      location.reload()
      reduxDispatch(setIsLoadingGlobal(false));
      reduxDispatch(setIsLoading(false));
    }
  };

  const openLinkInstallFlask = () => {
    window.open('https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk', '_blank')?.focus();
  };

  return (
    <>
      <BoxContent>
        <BoxLogo>
          <img src={logoMina} />
        </BoxLogo>
        <BoxCenter>
          <BoxInsideMetamask>Mina Snaps enable Mina network inside Metamask</BoxInsideMetamask>
        </BoxCenter>

        <BoxCenter sx={{ paddingBottom: '25px' }}>
          {!isInstalledWallet && (
            <ButtonCustomRequiredMetamask onClick={()=> openLinkInstallFlask()}>
              <BoxImg>
                <img src={wainning} />
              </BoxImg>
              Metamask Flask is required to run snap!
            </ButtonCustomRequiredMetamask>
          )}
        </BoxCenter>
        <BoxCenter>
          <Button
            className={!isInstalledWallet ? 'isUnInstalledWallet' : 'connectMetamask'}
            onClick={handleConnectClick}
          >
            {isLoading ? (
              <BoxConnecting>
                CONNECTING<Box className="dot-loadding"></Box>
              </BoxConnecting>
            ) : (
              'CONNECT TO METAMASK'
            )}
          </Button>
        </BoxCenter>
      </BoxContent>
    </>
  );
};

const BoxConnecting = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));
const BoxImg = styled(Box)(() => ({
  marginRight: '7px',
}));

const ButtonCustomRequiredMetamask = styled(Button)<ButtonProps>(() => ({
  background: '#FC6643',
  border: '1px solid #000000',
  display: 'flex',
  justifyContent: 'center',
  width: '330px',
  ':hover': {
    cursor: 'hover',
  },
}));

const BoxCenter = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

const BoxLogo = styled(BoxCenter)(() => ({
  paddingTop: '40px',
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

export default ConnectWallet;
