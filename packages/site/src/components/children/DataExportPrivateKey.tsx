import { Box, Button, ButtonProps, styled } from '@mui/material';
import coppy from 'assets/icons/coppy.svg';
import React from 'react';

type Props = {
  address?: string;
  privateKey?: string;
  onDone: () => void;
};

const DataExportPrivateKey = ({ address, privateKey, onDone }: Props) => {
  const handelCoppy = () => {
    // navigator.clipboard.writeText(privateKey as string);

    const storage = document.createElement('textarea');
    storage.value = privateKey as string;
    const element = document.querySelector('#privateKey');
    (element as any).appendChild(storage);
    storage.select();
    storage.setSelectionRange(0, 99999);
    document.execCommand('copy');
    (element as any).removeChild(storage);
  };

  return (
    <>
      <Container>
        <BoxContentTitle>Wallet Address</BoxContentTitle>
        <BoxContentAddress>{address}</BoxContentAddress>
        <ContainerContent>
          <BoxCustomText id="privateKey">{privateKey}</BoxCustomText>
          <ButtonCustom onClick={handelCoppy} variant="text" disableElevation>
            <CustomImg>
              <img src={coppy}></img>
            </CustomImg>
            Copy to clipboard
          </ButtonCustom>
        </ContainerContent>
        <BoxAccton>
          <ButtonCustomDone variant="contained" disableElevation onClick={onDone}>
            Done
          </ButtonCustomDone>
        </BoxAccton>
      </Container>
    </>
  );
};
const BoxAccton = styled(Box)({
  paddingTop: '35px',
});
const ButtonCustomDone = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});
const CustomImg = styled(Box)({
  height: '14px',
  marginRight: '5px',
});

const ButtonCustom = styled(Button)<ButtonProps>({
  textTransform: 'none',
  color: '#594AF1',
  fontWeight: '500',
  padding: '0',
  minWidth: '20px',
  fontSize: '10px',
});
const BoxCustomText = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '15px',
  wordWrap: 'break-word',
  paddingBottom: '5px',
});

const BoxContentTitle = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '10px',
  lineHeight: '12px',
  paddingTop: '17px',
  color: '#000000',
});
const BoxContentAddress = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '15px',
  paddingTop: '4px',
  paddingBottom: '17px',
  color: '#000000',
  opacity: '0.4',
  wordWrap: 'break-word',
});

const ContainerContent = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  background: '#F9FAFC',
  border: '1px solid #D9D9D9',
  padding: '15px 10px',
  borderRadius: '8px',
}));

const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  paddingTop: '16px',
  paddingLeft: '5px',
  paddingRight: '5px',
  paddingBottom: '0px',
}));

export default DataExportPrivateKey;
