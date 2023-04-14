import Button from 'components/common/button';
import React from 'react';
import logoMina from 'assets/logo/logo-mina.svg';
import { useMinaSnap } from 'services/useMinaSnap';
import { Box, ButtonProps, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { connectWallet, setActiveAccount, setIsLoading, setIsLoadingGlobal, setTransactions, setUnlockWallet } from 'slices/walletSlice';
import { ethers } from 'ethers';
import wainning from 'assets/icons/wainning.svg';
import metamask from 'assets/logo/logo-metamask.png';
import metamaskFlask from 'assets/logo/logo-metamask-flask.png';

type Props = {};

const ConnectWallet: React.FC<Props> = () => {
  const reduxDispatch = useAppDispatch();
  const { connectToSnap, getSnap, AccountList, getAccountInfors, getTxHistory } = useMinaSnap();

  const { isInstalledWallet, isLoading } = useAppSelector((state) => state.wallet);

  const handleConnectClick = async () => {
    if (isLoading) return;
    try {
      reduxDispatch(setIsLoadingGlobal(true));

      reduxDispatch(setIsLoading(true));
      await connectToSnap();
      const isInstalledSnap = await getSnap();
      // await SwitchNetwork('Mainnet');
      const accountList = await AccountList();
      reduxDispatch(
        connectWallet({
          accountList,
          isInstalledSnap,
        }),
      );
      const accountInfor = await getAccountInfors();
      reduxDispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey as string,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
          accountName: accountInfor.name as string,
          inferredNonce: accountInfor.inferredNonce as string,
        }),
      );
      const txList = await getTxHistory();
      reduxDispatch(setTransactions(txList));
      reduxDispatch(setUnlockWallet(true));
      reduxDispatch(setIsLoading(false));
      reduxDispatch(setIsLoadingGlobal(false));
      location.reload()
    } catch (e) {
      console.log('-lock wallet');
      
      reduxDispatch(setUnlockWallet(false));
      reduxDispatch(setIsLoadingGlobal(false));
    } finally {
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
            <WrapperWarning>
              <WarningMessage>
                <BoxImg>
                  <img src={wainning} />
                </BoxImg>
                Please remember to disable 
                <BoxIcon>
                  <img src={metamask} />
                </BoxIcon>
                Metamask and enable 
                <BoxIcon>
                  <img src={metamaskFlask} />
                </BoxIcon>
                Metamask Flask only.             
              </WarningMessage>
              
              <ButtonCustomRequiredMetamask onClick={()=> openLinkInstallFlask()}>
                <BoxImg>
                  <img src={wainning} />
                </BoxImg>
                Metamask Flask is required to run snap!
              </ButtonCustomRequiredMetamask>
            </WrapperWarning>
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

const BoxIcon = styled(Box)(() => ({
  margin: '0px 4px',
  img : {
    width:'20px',
    height: '20px',
  }
}));

const WrapperWarning = styled(Box)(() =>({
}) );

const WarningMessage = styled(Box)(() => ({
  background: '#FC6643',
  border: '1px solid #000000',
  display: 'flex',
  justifyContent: 'center',
  width: '592px',
  marginBottom: '25px',
  color: '#FFFFFF',
  height: '44px',
  borderRadius: '5px',
  alignItems: 'center',
}));



const ButtonCustomRequiredMetamask = styled(Button)<ButtonProps>(() => ({
  background: '#FC6643',
  border: '1px solid #000000',
  display: 'flex',
  justifyContent: 'center',
  width: '330px',
  margin: 'auto',
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
