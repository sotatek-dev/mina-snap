import React, { useEffect } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Grid,
  LinearProgress,
  Modal,
  styled,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { ResultAccountList } from 'types/account';
import { useMinaSnap } from 'services';
import { useAppDispatch } from 'hooks/redux';
import { setListAccounts } from 'slices/walletSlice';

interface IChangeAccountName {
  open: boolean;
  onClose: () => void;
  data?: ResultAccountList;
  onChange: (dataChange: ResultAccountList) => void;
}

const ChangeAccountName = ({ open, onClose, data, onChange }: IChangeAccountName) => {
  const [nameAccount, setNameAccount] = React.useState<string>('');
  const { EditAccountName, AccountList } = useMinaSnap();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const reduxDispatch = useAppDispatch();
  const state = data;

  const handelChange = async () => {
    setLoading(true);
    await EditAccountName({
      index: Number(state?.index),
      isImported: state?.isImported as boolean,
      name: nameAccount,
    });
    const accountList = await AccountList().finally(() => {
      const dataChange: ResultAccountList = {
        address: state?.address as string,
        balance: {
          total: state?.balance.total as string,
        },
        index: Number(state?.index),
        isImported: state?.isImported as boolean,
        name: nameAccount,
      };
      setLoading(false);
      onClose();
      onChange(dataChange);
    });
    await reduxDispatch(setListAccounts(accountList));
  };

  const checkValidate = () => {
    if (!nameAccount) {
      return 'disableButton';
    }
    if (nameAccount.length > 16) {
      return 'disableButton';
    }
    if (isLoading) {
      return 'disableButton';
    }
  };

  useEffect(() => {
    setNameAccount('');
  }, [open]);

  return (
    <Modal disableAutoFocus={true} open={open}>
      <Container>
        <ContainerContent>
          <BoxTitleModal>Change Account Name</BoxTitleModal>

          <InputCustom
            variant={'outlined'}
            placeholder="No more than 16 characters"
            value={nameAccount}
            disabled={isLoading}
            onChange={(e) => {
              setNameAccount(e.target.value);
            }}
          />
        </ContainerContent>
        <BoxCustomDivider></BoxCustomDivider>
        {isLoading && <LinearProgressCustom />}
        <Box>
          <GridContainer container rowSpacing={1}>
            <GridItem xs={6}>
              <ButtonCustomCancel disabled={isLoading} onClick={onClose} variant="text" disableElevation>
                Cancel
              </ButtonCustomCancel>
            </GridItem>
            <Grid xs={6}>
              <ButtonCustomConfirm onClick={handelChange} className={checkValidate()} variant="text" disableElevation>
                Confirm
              </ButtonCustomConfirm>
            </Grid>
          </GridContainer>
        </Box>
      </Container>
    </Modal>
  );
};

const LinearProgressCustom = styled(LinearProgress)({
  height: '2px !important',
});
const ButtonCustomCancel = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  color: '#000000',
  fontWeight: '500',
  fontSize: '10px',
});
const ButtonCustomConfirm = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  color: '#594AF1',
  fontWeight: '500',
  fontSize: '10px',
});
const GridItem = styled(Grid)({
  borderRight: '1px solid #D9D9D9',
});
const GridContainer = styled(Grid)({
  margin: 0,
  padding: 0,
});
const BoxCustomDivider = styled(Box)({
  borderBottom: '1px solid #D9D9D9',
});

const InputCustom = styled(TextField)<TextFieldProps>({
  paddingBottom: 20,
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',
  input: {
    padding: '0.5rem 1rem',
    color: '#707D96',
  },
  '& input': {
    fontSize: '10px',
  },
});
const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  background: '#FFFFFF',
  left: '50%',
  maxHeight: '550px',
  transform: 'translate(-50%, -50%)',
  boxSizing: 'border-box',
  width: '310px',
  padding: '16px 0px 0px 0px',
  border: '1px solid #ECECF6',
  boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  '&:focus-visible': {
    outline: 'none',
  },
}));
const ContainerContent = styled(Box)(() => ({
  padding: '0px 13px',
}));

const BoxTitleModal = styled(Box)({
  paddingBottom: 20,
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#000000',
});
export default ChangeAccountName;
