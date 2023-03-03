import { Box, Button, ButtonProps, Collapse, List, styled, TextField, TextFieldProps } from '@mui/material';
import ModalCommon from 'components/common/modal';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading, setListAccounts } from 'slices/walletSlice';
import { ResultCreateAccount } from 'types/account';
import { TransitionGroup } from 'react-transition-group';
import showDown from 'assets/icons/show-down.svg';
import { TypeResponseSignature } from 'types/transaction';

type Props = {
  onCloseModal: () => void;
};

function renderItem({ signature }: TypeResponseSignature) {
  return (
    <BoxSignature>
      <Box>Signature: </Box>
      <Box>field: {signature.field}</Box>
      <Box>scalar: {signature.scalar}</Box>
      <Box>signer: {signature.signer}</Box>
    </BoxSignature>
  );
}

const CreateNameAccount = ({ onCloseModal }: Props) => {
  const [nameAccount, setNameAccount] = useState('');
  const { Signature } = useMinaSnap();
  const dispatch = useAppDispatch();
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<TypeResponseSignature>();
  const { isLoading } = useAppSelector((state) => state.wallet);

  const sendRequest = async () => {
    try {
      dispatch(setIsLoading(true));
      await Signature(nameAccount)
        .then((res) => {
          setSignature(res);
          dispatch(setIsLoading(false));
        })
        .catch(() => {
          dispatch(setIsLoading(false));
        })
        .finally(() => {
          dispatch(setIsLoading(false));
        });
    } catch (e) {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <Container>
        <BoxTitle>Message</BoxTitle>
        <Box>
          <InputCustom
            sx={{ paddingTop: '5px' }}
            variant={'outlined'}
            placeholder="Message"
            value={nameAccount}
            onChange={(e) => {
              setNameAccount(e.target.value);
            }}
          />
        </Box>
        <BoxCustom>
          <ButtonCustom
            variant="contained"
            disableElevation
            className={!nameAccount || isLoading ? 'disable' : ''}
            onClick={() => {
              sendRequest();
            }}
          >
            Sign
          </ButtonCustom>
        </BoxCustom>
        {signature && (
          <>
            <BoxButtom
              onClick={() => {
                setShowSignature(!showSignature);
              }}
            >
              <IconBoxBack>
                Result <img src={showDown} />
              </IconBoxBack>
            </BoxButtom>
            <BoxShowSignature>
              <TransitionGroup>
                {showSignature && <Collapse>{renderItem(signature as TypeResponseSignature)}</Collapse>}
              </TransitionGroup>
            </BoxShowSignature>
          </>
        )}
      </Container>
    </>
  );
};

const BoxShowSignature = styled(Box)(() => ({
  marginTop: '10px',
  marginBottom: '10px',
}));

const IconBoxBack = styled(Box)({
  '& img': {
    animation: 'rotation 2s infinite linear',
    width: '8px',
    height: '6px',
  },
});

const BoxButtom = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  wordBreak: 'break-word',
  fontSize: '10px',
  fontWeight: '500',
  cursor: 'pointer',
  color: '#000000',
}));

const BoxSignature = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  wordBreak: 'break-word',
  fontSize: '10px',
}));

const BoxCustom = styled(Box)(() => ({
  paddingTop: '1.3rem',
  display: 'flex',
  justifyContent: 'end',
}));

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
  width: '50%',
  textTransform: 'none',
  background: '#594AF1',
  borderRadius: '5px',
});

export default CreateNameAccount;
