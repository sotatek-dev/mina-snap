import { Box, FormControl, FormHelperText, Snackbar, TextField } from '@mui/material';
import ButtonCommon from 'components/common/button';
import Modal from 'components/common/modal';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GAS_FEE } from 'utils/constants';
import IAdvanced from 'assets/icons/icon-advance.svg';
import Button from 'components/common/button';
import ModalConfirm from './ModalConfirm';
import { useAppSelector } from 'hooks/redux';
import { payloadSendTransaction } from 'types/transaction';
import { addressValid } from 'helpers/formatAccountAddress';
import { blockInvalidChar, blockInvalidInt, toPlainString } from 'utils/utils';

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
}

interface Props {
  active?: boolean;
  toggle?: boolean;
  disable?: boolean;
  isvalidvalue?: boolean;
}

const ModalTransfer = ({ open, clickOutSide, setOpenModal }: ModalProps) => {
  const { balance, inferredNonce } = useAppSelector((state) => state.wallet);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [gasFee, setGasFee] = useState(GAS_FEE.default);
  const [nonce, setNonce] = useState(inferredNonce);
  const [message, setMessage] = useState('');
  const [openToastMsg, setOpenToastMsg] = useState(false);

  const [txInfo, setTxInfo] = useState<payloadSendTransaction>({
    to: '',
    amount: 0,
    memo: '',
    fee: 0,
    nonce: 0,
  });
  const [isShowCotent, setIsShowContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const success = () => {
    setOpenModal();
    handleClickOutSide();
  };

  const handleClick = () => {
    if(
      addressValid(address) && 
      Number(amount) > 0 && 
      Number(amount) < Number(balance) && 
      gasFee >= 0 && 
      Number(nonce) > 0
    ) {
      setShowModal(disabled != true);
    }
    else{
      if(!addressValid(address)){
        setMessage('Please enter valid address');
        setOpenToastMsg(true);
        return
      } 
      if(Number(amount) < 0){
        setMessage('Please enter a valid transaction amount');
        setOpenToastMsg(true);
        return
      } 
      if(Number(amount) > Number(balance)){
        setMessage('Insufficient balance');
        setOpenToastMsg(true);
        return
      }
      if(gasFee < 0){
        setMessage('Please enter a valid transaction fee');
        setOpenToastMsg(true);
        return
      }
      if(Number(nonce) <= 0){
        setMessage('Please enter a valid nonce');
        setOpenToastMsg(true);
        return
      }
    }

    const tx = {
      to: address,
      amount: Number(balance) == Number(amount) ? Number(amount) - Number(gasFee) : Number(amount),
      memo: memo,
      fee: Number(gasFee),
      nonce: Number(nonce),
    };
    setTxInfo(tx);
  };

  const handleClickOutSide = () => {
    setShowModal(false);
  };

  const handleNonce = (e: any) => {
    if (e.target.value) {
      setNonce(e.target.value);
    } else setNonce(inferredNonce);
  };

  const handleOnChangeBalance = (event: any) => {
    setAmount(event.target.value);
  };

  useEffect(() => {
    if (address && amount) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [balance, amount, address, nonce, gasFee]);

  useEffect(() => {
    setAddress('');
    setAmount('');
    setGasFee(GAS_FEE.default);
    setNonce(inferredNonce);
    setIsShowContent(false);
  }, [open, inferredNonce]);

  return (
    <Modal open={open} title="Send" clickOutSide={clickOutSide} setOpenModal={setOpenModal}>
      <FormControl fullWidth required>
        <ContentBox>
          <RequiredBox>
            <Tittle>To</Tittle>

            <Input
              autoComplete='off'
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              variant="outlined"
              placeholder="Address"
              fullWidth
              size="small"
              inputProps={{
                style: {
                  height: '34px',
                  margin: '0 7px',
                  padding: '0px 0px',
                  fontSize: '10px',
                },
              }}
            />
            <WTitle>
              <Tittle>Amount</Tittle>
              <Balance>Balance: {balance}</Balance>
              <MaxAmount onClick={() => setAmount(balance.toString())}>Max</MaxAmount>
            </WTitle>
            <Input
              onKeyDown={blockInvalidChar}
              value={amount}
              type="number"
              variant="outlined"
              placeholder="0"
              onChange={(event) => {
                handleOnChangeBalance(event);
              }}
              fullWidth
              size="small"
              inputProps={{
                style: {
                  height: '34px',
                  margin: '0 7px',
                  padding: '0px 0px',
                  fontSize: '10px',
                },
              }}
            />
            <Tittle>Memo(Optional)</Tittle>
            <Input
              variant="outlined"
              fullWidth
              size="small"
              onChange={(event) => setMemo(event.target.value)}
              inputProps={{
                style: {
                  height: '34px',
                  margin: '0 7px',
                  padding: '0px 0px',
                  fontSize: '10px',
                },
              }}
            />
            <WTitle>
              <Tittle>Fee</Tittle>
              <Balance>{toPlainString(gasFee)}</Balance>
            </WTitle>
            <WOption>
              <Option
                active={gasFee == GAS_FEE.slow}
                onClick={() => {
                  setGasFee(GAS_FEE.slow);
                }}
              >
                Slow
              </Option>
              <Option
                active={gasFee == GAS_FEE.default}
                onClick={() => {
                  setGasFee(GAS_FEE.default);
                }}
              >
                Default
              </Option>
              <Option
                active={gasFee == GAS_FEE.fast}
                onClick={() => {
                  setGasFee(GAS_FEE.fast);
                }}
              >
                Fast
              </Option>
            </WOption>
          </RequiredBox>
          <AdvancedBox>
            <Toggle onClick={() => setIsShowContent(!isShowCotent)}>
              Advanced
              <AdvancedIcon toggle={isShowCotent} src={IAdvanced}></AdvancedIcon>
            </Toggle>
            {isShowCotent && (
              <AdvancedContent>
                <Tittle>Transaction Fee</Tittle>
                <Input
                  onKeyDown={blockInvalidChar}
                  type="number"
                  variant="outlined"
                  placeholder={gasFee.toString()}
                  fullWidth
                  size="small"
                  onChange={(event) => {
                    setGasFee(Number(event.target.value));
                  }}
                  inputProps={{
                    style: {
                      height: '34px',
                      margin: '0 7px',
                      padding: '0px 0px',
                      fontSize: '10px',
                    },
                  }}
                />
                {gasFee > 10 && <Message >Fees are much higher than average</Message>}
                <Tittle>Nonce</Tittle>
                <Input
                  onKeyDown={blockInvalidInt}
                  variant="outlined"
                  placeholder={`Nonce` + ' ' + nonce}
                  fullWidth
                  size="small"
                  type="number"
                  onChange={(event) => {
                    handleNonce(event);
                  }}
                  inputProps={{
                    style: {
                      height: '34px',
                      margin: '0 7px',
                      padding: '0px 0px',
                      fontSize: '10px',
                    },
                  }}
                />
              </AdvancedContent>
            )}
          </AdvancedBox>
        </ContentBox>
        <BoxButton>
          <ButtonNext disable={disabled} onClick={handleClick} type="submit">
            Next
          </ButtonNext>
          <ModalConfirm
            open={showModal}
            clickOutSide={true}
            closeSucces={success}
            setOpenModal={handleClickOutSide}
            txInfoProp={txInfo}
          />
          <ToastMessage
            autoHideDuration={5000}
            open={openToastMsg}
            onClose={() => setOpenToastMsg(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <ContentMessage>{message}</ContentMessage>
          </ToastMessage>
        </BoxButton>
      </FormControl>
    </Modal>
  );
};

const ContentBox = styled.div`
  width: 300px;
  padding: 0 8px;
  max-height: 443px;
  min-height: 443px;
  overflow-y: scroll;
`;

const RequiredBox = styled.div`
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 17px;
`;

const WTitle = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const Tittle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #000000;
  margin-top: 16px;
  margin-bottom: 5px;
`;

const Balance = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #00000066;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const MaxAmount = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  position: absolute;
  right: 8px;
  top: 47px;
  color: #5972f5;
  z-index: 999;
  :hover {
    cursor: pointer;
  }
`;

const Input = styled(TextField)<Props>`
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
    }
    & .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border: 1px solid ${(props) => (props.isvalidvalue ? '#d32f2f' : '#594AF1')};
      }
      &:hover fieldset {
        border: 1px solid ${(props) => (props.isvalidvalue ? '#d32f2f' : '#594AF1')};
      },
    }
`;

const WOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Option = styled(ButtonCommon)<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92px;
  max-height: 30px;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: ${(props) => (props.active ? '#594AF1' : '#000000')};
  background: #f9fafc;
  border: 1px solid ${(props) => (props.active ? '#594AF1' : '#D9D9D9')};
  border-radius: 4px;
`;

const AdvancedBox = styled.div``;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #594af1;
  :hover {
    cursor: pointer;
  }
`;

const AdvancedIcon = styled.img<Props>`
  transform: ${(props) => (props.toggle ? 'rotate(0)' : 'rotate(3.142rad)')};
  margin-left: 4px;
`;

const AdvancedContent = styled.div``;

const BoxButton = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: end;
`;

const ButtonNext = styled(Button)<Props>`
  display: flex;
  color: #ffffff;
  background: ${(props) => (props.disable ? '#D9D9D9' : '#594AF1')};
  border: none;
  height: 34px;
  width: 270px;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const Message = styled(FormHelperText)`
  margin: 0;
  &.css-1wc848c-MuiFormHelperText-root {
    margin: 0;
  }
`;

const ToastMessage = styled(Snackbar)({
  '&.MuiSnackbar-root': {
    width: '207px',
    height: '34px',
    background: '#000000',
    borderRadius: '5px',
    padding: '0 8px'
  },
  '&.MuiSnackbar-anchorOriginBottomCenter': {
    top: '37%',
  },
});

const ContentMessage = styled(Box)({
  width: '100%',
  height: '100%',
  fontStyle: 'normal',
  fontWeight: '300',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export default ModalTransfer;
