import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts } from 'slices/walletSlice';
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
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.wallet);

  const sendRequest = async () => {
    try {
      dispatch(setIsLoading(true));
      const payload = {
        name: AccountName,
        privateKey: privateKey,
      };
      await ImportAccount(payload)
        .then((account) => {
          dispatch(setIsLoading(false));
          onCloseModal(account);
        })
        .catch(() => {
          dispatch(setIsLoading(false));
        })
        .finally(() => {
          dispatch(setIsLoading(false));
        });

      const accountList = await AccountList();
      await dispatch(setListAccounts(accountList));
    } catch (error) {
      dispatch(setIsLoading(false));
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
          className={!privateKey || isLoading ? 'disable' : ''}
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
