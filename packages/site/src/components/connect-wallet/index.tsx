import Button from 'components/common/button';
import React from 'react';
import logoMina from 'assets/logo/logo-mina.svg';
import { useMinaSnap } from 'services/useMinaSnap';
import { Box, styled } from '@mui/material';
import { useAppSelector } from 'hooks/redux';

const BoxCenter = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

const BoxContent = styled(Box)(() => ({
  maxWidth: '430px',
  margin: 'auto',
}));

const BoxInsideMetamask = styled(Box)(() => ({
  fontFamily: 'Inter',
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
  const { connectToSnap } = useMinaSnap();

  const { isInstalled } = useAppSelector((state) => state.wallet);

  const handleConnectClick = async () => {
    await connectToSnap();
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
          {!isInstalled && <Button>Metamask Flask is required to run snap!</Button>}
        </BoxCenter>
        <BoxCenter>
          <Button onClick={handleConnectClick}>CONNECT TO METAMASK</Button>
        </BoxCenter>
        {/* <Button onClick={handleTest}>CONNECT TO METAMASK</Button> */}
      </BoxContent>
    </>
  );
};

export default ConnectWallet;
