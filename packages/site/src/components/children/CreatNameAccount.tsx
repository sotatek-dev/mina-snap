import { Box, Button, ButtonProps, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { ethers } from 'ethers';
import { formatBalance } from 'helpers/formatAccountAddress';
import { useAppDispatch } from 'hooks/redux';
import { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts, setTransactions } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';
import ImportPrivateKey from './ImportPrivateKey';

type Props = {
  onCloseModal: (data: ResultCreateAccount) => void;
  type: string;
  index: number;
};

const CreateNameAccount = ({ onCloseModal, type, index }: Props) => {
  const [nameAccount, setNameAccount] = useState('');
  const { CreateAccount, AccountList, getAccountInfors, getTxHistory } = useMinaSnap();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const nameDefault = 'Account ' + index;

  const handleOnChangeAccountName = (value: string) => {
    if (value.length > 16) {
      return 0;
    } else setNameAccount(value);
  };

  const sendRequest = async () => {
    switch (type) {
      case 'create':
        try {
          dispatch(setTransactions([]));
          // dispatch(setListAccounts([]));
          dispatch(setIsLoading(true));
          const account = await CreateAccount(nameAccount || nameDefault);
          const accountList = await AccountList();
          const accountInfor = await getAccountInfors();
          const txList = await getTxHistory();
          dispatch(setTransactions(txList));
          await dispatch(setListAccounts(accountList));
          onCloseModal({
            ...account,
            balance: formatBalance(ethers.utils.formatUnits(accountInfor.balance.total, 'gwei')) as string,
          });
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
            autoComplete="off"
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            placeholder={nameDefault}
            value={nameAccount}
            onChange={(e) => handleOnChangeAccountName(e.target.value)}
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
        title="Import Private Key"
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
  height: '251px',
  padding: '12px 16px 0',
}));
const BoxTitle = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#000000',
  paddingBottom: '5px',
}));

const BoxContent = styled(Box)(() => ({
  minHeight: '200px',
}));

const InputCustom = styled(TextField)<TextFieldProps>({
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',

  input: {
    padding: '0.5rem',
    color: '#000000',
  },
  '& input': {
    fontSize: '12px',
  },
  '& .MuiOutlinedInput-root': {
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

export default CreateNameAccount;
