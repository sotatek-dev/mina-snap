import { Box, Button, ButtonProps, Snackbar, styled } from '@mui/material';
import coppy from 'assets/icons/coppy.svg';
import { handelCoppy } from 'helpers/handleCoppy';
import { useState } from 'react';

type Props = {
  address?: string;
  privateKey?: string;
  onDone: () => void;
};

const DataExportPrivateKey = ({ address, privateKey, onDone }: Props) => {
  const [open, setOpen] = useState(false);
  const handleOnClickCoppy = () => {
    handelCoppy(privateKey as string, "#privateKey");
    setOpen(true)
  }

  return (
    <>
      <Container>
        <BoxContentTitle>Wallet Address</BoxContentTitle>
        <BoxContentAddress>{address}</BoxContentAddress>
        <ContainerContent>
          <BoxCustomText id="privateKey">{privateKey}</BoxCustomText>
          <ButtonCustom onClick={()=>handleOnClickCoppy()} variant="text" disableElevation>
            <CustomImg>
              <img src={coppy}></img>
            </CustomImg>
            Copy to clipboard
          </ButtonCustom>
          <Message
            autoHideDuration={5000}
            open={open}
            onClose={() => setOpen(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
          }}
          >
            <ContentMessage>
              Copied!
            </ContentMessage>
          </Message>
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
  textAlign: 'center',
});
const ButtonCustomDone = styled(Button)<ButtonProps>({
  width: '248px',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
  margin : '0 16px',

});
const CustomImg = styled(Box)({
  height: '21px',
  marginRight: '5px',
});

const ButtonCustom = styled(Button)<ButtonProps>({
  textTransform: 'none',
  color: '#594AF1',
  fontWeight: '600',
  padding: '0',
  minWidth: '20px',
  fontSize: '12px',
});

const Message = styled(Snackbar)({
  '&.MuiSnackbar-root': {
    width: '66px',
    height: '34px',
  },
  '&.MuiSnackbar-anchorOriginBottomCenter': {
    top: '65%',
  }
});

const ContentMessage = styled(Box)({
  width: '100%',
  height: '100%',
  background: '#000000',
  borderRadius: '5px',
  fontStyle: 'normal',
  fontWeight: '300',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const BoxCustomText = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '12px',
  lineHeight: '15px',
  wordWrap: 'break-word',
  paddingBottom: '5px',
});

const BoxContentTitle = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '12px',
  lineHeight: '12px',
  paddingTop: '17px',
  color: '#000000',
  margin : '0 16px',
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
  margin : '0 16px',
});

const ContainerContent = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  background: '#F9FAFC',
  border: '1px solid #D9D9D9',
  padding: '21px 14px',
  borderRadius: '8px',
  margin: '0 16px',
  height: '56px',
}));

const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  width: '280px',
}));

export default DataExportPrivateKey;
