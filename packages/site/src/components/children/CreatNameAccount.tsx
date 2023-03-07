import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { useAppDispatch } from 'hooks/redux';
import { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';
import ImportPrivateKey from './ImportPrivateKey';

type Props = {
  onCloseModal: (data: ResultCreateAccount) => void;
  type: string;
  index: number;
};

const CreateNameAccount = ({ onCloseModal, type, index }: Props) => {
  const [nameAccount, setNameAccount] = useState('');
  const { CreateAccount, AccountList } = useMinaSnap();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const nameDefault = "Account " + index;

  const sendRequest = async () => {
    switch (type) {
      case 'create':
        try {
          dispatch(setIsLoading(true));
          const account = await CreateAccount(nameAccount || nameDefault);
          const accountList = await AccountList();
          await dispatch(setListAccounts(accountList));
          onCloseModal(account);
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

        <BoxContent>
          <InputCustom
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            placeholder={nameDefault}
            value={nameAccount}
            onChange={(e) => {
              setNameAccount(e.target.value);
            }}
          />
        </BoxContent>

        <ButtonCustom
          variant="contained"
          disableElevation
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
          AccountName={nameAccount || nameDefault}
        ></ImportPrivateKey>
      </ModalCommon>
    </>
  );
};

const Container = styled(Box)(() => ({
  width: '276px',
  height: '246px',
  padding: '12px 12px 0',
}));
const BoxTitle = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '12px',
  lineHeight: '12px',
  color: '#000000',
}));

const BoxContent = styled(Box)(() =>({
  minHeight: '200px',
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
    fontSize: '12px',
  },
});

const ButtonCustom = styled(Button)<ButtonProps>({
  width: '100%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});

export default CreateNameAccount;
