import { FormControl, FormHelperText, TextField } from '@mui/material';
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
    setShowModal(disabled != true);
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

  const isPositiveInteger = (num: number) => {
    return Number.isInteger(num) && num > 0;
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
    if (
      addressValid(address) &&
      Number(amount) > 0 &&
      Number(amount) <= Number(balance) &&
      gasFee > 0 &&
      isPositiveInteger(Number(nonce))
    ) {
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
            {!addressValid(address) && address && <Message error>Please enter valid address</Message>}
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
              isvalidvalue={Number(amount) < 0 || Number(amount) > Number(balance)}
            />
            {Number(amount) < 0 && <Message error>Please enter a valid amount</Message>}
            {Number(amount) > Number(balance) && <Message error>Insufficient balance</Message>}
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
                  isvalidvalue={gasFee < GAS_FEE.slow || gasFee > 10}
                />
                {gasFee > 10 && <Message error>Fees are much higher than average</Message>}
                {gasFee <= 0 && <Message error>Please enter a valid transaction fee</Message>}
                {gasFee < GAS_FEE.slow && gasFee > 0 && (
                  <Message error>
                    Invalid user command. Fee {toPlainString(gasFee)} is less than the minimum fee of {GAS_FEE.slow}.
                  </Message>
                )}
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
                  isvalidvalue={!isPositiveInteger(Number(nonce)) && nonce ? true : false}
                />
                {!isPositiveInteger(Number(nonce)) && nonce && <Message error>Please enter a valid nonce</Message>}
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
        border: 1px solid #594AF1;
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

export default ModalTransfer;
