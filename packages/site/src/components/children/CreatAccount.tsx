import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import { useAppDispatch } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setListAccounts } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';

const Container = styled(Box)(() => ({
  paddingTop: '16px',
  paddingLeft: '5px',
  paddingRight: '5px',
  paddingBottom: '0px',
}));
const BoxTitle = styled(Box)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#000000',
}));

const InputCustom = styled(TextField)<TextFieldProps>({
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',
  input: {
    padding: '0.5rem 1rem',
    color: '#707D96',
  },
});

const ButtonCustom = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});

type Props = {
  onCloseModal: (data: ResultCreateAccount) => void;
};

const CreatAccountInput = ({ onCloseModal }: Props) => {
  const [state, setState] = useState('');
  const { CreateAccount, AccountList } = useMinaSnap();
  const reduxDispatch = useAppDispatch();

  const sendRequest = async () => {
    try {
      const account = await CreateAccount(state);
      const accountList = await AccountList();
      await reduxDispatch(setListAccounts(accountList));
      onCloseModal(account);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <BoxTitle>Please enter your account name</BoxTitle>
        <Box sx={{ paddingBottom: '5rem' }}>
          <InputCustom
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            placeholder="Search"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
            }}
          />
        </Box>
        <ButtonCustom
          variant="contained"
          disableElevation
          onClick={() => {
            sendRequest();
          }}
        >
          Confirm
        </ButtonCustom>
      </Container>
    </>
  );
};

export default CreatAccountInput;
