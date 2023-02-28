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
  fontFamily: 'Inter Regular',
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
  '& input': {
    fontSize: '10px',
  },
});

const ButtonCustom = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});

type Props = {
  AccountName: string;
  onCloseModal: (data: ResultCreateAccount) => void;
};

const ImportPrivateKey = ({ AccountName, onCloseModal }: Props) => {
  const [privateKey, setPrivateKey] = useState('');
  const { AccountList, ImportAccount } = useMinaSnap();
  const reduxDispatch = useAppDispatch();

  const sendRequest = async () => {
    try {
      const payload = {
        name: AccountName,
        privateKey: privateKey,
      };
      const account = await ImportAccount(payload);
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
        <BoxTitle>Please enter Private Key</BoxTitle>
        <Box sx={{ paddingBottom: '5rem' }}>
          <InputCustom
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            multiline
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
            }}
          />
        </Box>
        <ButtonCustom
          disabled={!privateKey}
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

export default ImportPrivateKey;
