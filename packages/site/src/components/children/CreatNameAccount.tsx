import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { useAppDispatch } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setListAccounts } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';
import ImportPrivateKey from './ImportPrivateKey';

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
  type: string;
};

const CreateNameAccount = ({ onCloseModal, type }: Props) => {
  const [nameAccount, setNameAccount] = useState('');
  const { CreateAccount, AccountList } = useMinaSnap();
  const reduxDispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);

  const sendRequest = async () => {
    switch (type) {
      case 'create':
        try {
          const account = await CreateAccount(nameAccount);
          const accountList = await AccountList();
          await reduxDispatch(setListAccounts(accountList));
          onCloseModal(account);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'import':
        setOpenModal(true);
        break;
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
            value={nameAccount}
            onChange={(e) => {
              setNameAccount(e.target.value);
            }}
          />
        </Box>
        <ButtonCustom
          variant="contained"
          disableElevation
          disabled={!nameAccount}
          onClick={() => {
            sendRequest();
          }}
        >
          {(() => {
            switch (type) {
              case 'create':
                return 'Confirm';
              case 'import':
                return 'Next';
            }
          })()}
        </ButtonCustom>
      </Container>
      <ModalCommon
        open={openModal}
        title="Account Name"
        setOpenModal={() => {
          setOpenModal(false);
        }}
      >
        <ImportPrivateKey
          onCloseModal={(account) => {
            onCloseModal(account), setOpenModal(false);
          }}
          AccountName={nameAccount}
        ></ImportPrivateKey>
      </ModalCommon>
    </>
  );
};

export default CreateNameAccount;
