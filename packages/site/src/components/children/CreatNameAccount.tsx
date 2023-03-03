import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';
import ImportPrivateKey from './ImportPrivateKey';

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
  onCloseModal: (data: ResultCreateAccount) => void;
  type: string;
};

const CreateNameAccount = ({ onCloseModal, type }: Props) => {
  const [nameAccount, setNameAccount] = useState('');
  const { CreateAccount, AccountList } = useMinaSnap();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const { isLoading } = useAppSelector((state) => state.wallet);

  const sendRequest = async () => {
    switch (type) {
      case 'create':
        try {
          dispatch(setIsLoading(true));
          await CreateAccount(nameAccount)
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

          dispatch(setIsLoading(false));
        } catch (error) {
          dispatch(setIsLoading(false));
        }
        break;
      case 'import':
        setOpenModal(true);
        break;
    }
  };

  const closeInport = (account: ResultCreateAccount) => {
    onCloseModal(account), setOpenModal(false);
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
          className={!nameAccount || isLoading ? 'disable' : ''}
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
            closeInport(account);
          }}
          AccountName={nameAccount}
        ></ImportPrivateKey>
      </ModalCommon>
    </>
  );
};

export default CreateNameAccount;
