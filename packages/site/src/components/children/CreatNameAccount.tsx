import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { ethers } from 'ethers';
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
  const { CreateAccount, AccountList, getAccountInfors } = useMinaSnap();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const nameDefault = 'Account ' + index;

  const sendRequest = async () => {
    switch (type) {
      case 'create':
        try {
          dispatch(setIsLoading(true));
          const account = await CreateAccount(nameAccount || nameDefault);
          const accountList = await AccountList();
          const accountInfor = await getAccountInfors();
          await dispatch(setListAccounts(accountList));
          onCloseModal({ ...account, balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string });
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
            placeholder={nameDefault}
            value={nameAccount}
            onChange={(e) => {
              setNameAccount(e.target.value);
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

export default CreateNameAccount;
