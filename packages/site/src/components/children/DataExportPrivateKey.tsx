import { Box, Button, ButtonProps, styled } from '@mui/material';
import coppy from 'assets/icons/coppy.svg';
import { handelCoppy } from 'helpers/handleCoppy';

type Props = {
  address?: string;
  privateKey?: string;
  onDone: () => void;
};

const DataExportPrivateKey = ({ address, privateKey, onDone }: Props) => {
  return (
    <>
      <Container>
        <BoxContentTitle>Wallet Address</BoxContentTitle>
        <BoxContentAddress>{address}</BoxContentAddress>
        <ContainerContent>
          <BoxCustomText id="privateKey">{privateKey}</BoxCustomText>
          <ButtonCustom onClick={()=>handelCoppy(privateKey as string, "#privateKey")} variant="text" disableElevation>
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
  textAlign: 'center',
});
const ButtonCustomDone = styled(Button)<ButtonProps>({
  width: '270px',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
  margin : '0 12px',

});
const CustomImg = styled(Box)({
  height: '14px',
  marginRight: '5px',
});

const ButtonCustom = styled(Button)<ButtonProps>({
  textTransform: 'none',
  color: '#594AF1',
  fontWeight: '600',
  padding: '0',
  minWidth: '20px',
  fontSize: '10px',
});
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
  margin : '0 12px',
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
  margin : '0 12px',
});

const ContainerContent = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  background: '#F9FAFC',
  border: '1px solid #D9D9D9',
  padding: '21px 14px',
  borderRadius: '8px',
  margin: '0 8px',
  height: '56px',
}));

const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  width: '300px',
}));

export default DataExportPrivateKey;
