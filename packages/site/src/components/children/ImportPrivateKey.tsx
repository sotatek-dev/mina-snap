import { Box, Button, ButtonProps, Snackbar, styled, TextField, TextFieldProps } from '@mui/material';
import { ethers } from 'ethers';
import { formatBalance } from 'helpers/formatAccountAddress';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts, setTransactions } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';

type Props = {
  AccountName: string;
  onCloseModal: (data: ResultCreateAccount) => void;
};

const ImportPrivateKey = ({ AccountName, onCloseModal }: Props) => {
  const [privateKey, setPrivateKey] = useState('');
  const { AccountList, ImportAccount, getAccountInfors, getTxHistory } = useMinaSnap();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.wallet);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const sendRequest = async () => {
    try {
      dispatch(setIsLoading(true));
      const payload = {
        name: AccountName,
        privateKey: privateKey,
      };
      await ImportAccount(payload).then(async (res) => {
        dispatch(setTransactions([]));
        dispatch(setListAccounts([]));
        const accountInfor = await getAccountInfors();

        onCloseModal({
          ...res,
          balance: formatBalance(ethers.utils.formatUnits(accountInfor.balance.total, 'gwei')) as string,
        });
      });

      const accountList = await AccountList();
      const txList = await getTxHistory();
      dispatch(setTransactions(txList));
      dispatch(setIsLoading(false));
      await dispatch(setListAccounts(accountList));
    } catch (error: any) {
      setMessage(error?.message);
      setOpen(true);
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <Container>
        <BoxTitle>Please enter Private Key</BoxTitle>
        <BoxContent>
          <InputCustom
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            multiline
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
            }}
          />
        </BoxContent>
        <ButtonCustom
          className={!privateKey || isLoading ? 'disable' : ''}
          variant="contained"
          disableElevation
          onClick={() => {
            sendRequest();
          }}
        >
          Confirm
        </ButtonCustom>
        <Message
          autoHideDuration={5000}
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <ContentMessage>{message}</ContentMessage>
        </Message>
      </Container>
    </>
  );
};

const Container = styled(Box)(() => ({
  width: '276px',
  height: '250px',
  padding: '12px 16px 0',
}));

const BoxTitle = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#000000',
}));

const BoxContent = styled(Box)(() => ({
  minHeight: '200px',
}));

const InputCustom = styled(TextField)<TextFieldProps>({
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',
  input: {
    color: '#707D96',
  },
  '& textarea': {
    fontSize: '10px',
    lineHeight: '12px',
  },
  '& .MuiOutlinedInput-root': {
    padding: '11px 6px',
    height: '68px',
    alignItems: 'start',
    '&:hover fieldset': {
      borderColor: '#594AF1',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #594AF1',
    },
  },
});

const ButtonCustom = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});

const Message = styled(Snackbar)({
  '&.MuiSnackbar-root': {
    width: '275px',
    height: '34px',
  },
  '&.MuiSnackbar-anchorOriginBottomCenter': {
    top: '47%',
  },
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
});

export default ImportPrivateKey;
