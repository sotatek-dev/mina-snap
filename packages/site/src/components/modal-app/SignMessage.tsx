import { Box, Button, ButtonProps, Collapse, styled, TextField, TextFieldProps } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setIsLoading } from 'slices/walletSlice';
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
      const res = await Signature(nameAccount);
      setSignature(res);
      dispatch(setIsLoading(false));
    } catch (e) {
      dispatch(setIsLoading(false));
    }
  };

  const style0 = { transform: 'rotate(0deg)' };
  const style180 = { transform: 'rotate(180deg)' };

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
                Result <img src={showDown} style={showSignature ? style180 : style0} />
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
  paddingTop: '20px',
  fontFamily: 'Inter Regular',
  wordBreak: 'break-word',
  fontSize: '10px',
  fontWeight: '600',
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
  fontWeight: '600',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#000000',
}));

const InputCustom = styled(TextField)<TextFieldProps>({
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',
  input: {
    padding: '11px 7px',
    color: '#000000',
  },
  '& input': {
    fontSize: '10px',
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
