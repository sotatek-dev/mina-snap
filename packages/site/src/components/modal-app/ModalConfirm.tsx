import { Box, Snackbar } from '@mui/material';
import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useEffect, useState } from 'react';
import { useMinaSnap } from 'services';
import { setActiveAccount, setListAccounts, setTransactions } from 'slices/walletSlice';
import styled from 'styled-components';
import { payloadSendTransaction } from 'types/transaction';
import { getRealErrorMsg, toPlainString } from 'utils/utils';

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
  txInfoProp: payloadSendTransaction;
  closeSucces: () => void;
}

interface Props {
  disable: boolean;
}

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const ModalConfirm = ({ open, clickOutSide, setOpenModal, txInfoProp, closeSucces }: ModalProps) => {
  const { SendTransaction, AccountList, getAccountInfors, getTxHistory } = useMinaSnap();
  const { activeAccount, inferredNonce } = useAppSelector((state) => state.wallet);
  const [loadingSend, setLoadingSend] = useState(false);
  const [message, setMessage] = useState('');
  const [openToastMsg, setOpenToastMsg] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) {
      setMessage('');
      setOpenToastMsg(false);
    }
  }, [open]);

  const interval = () => {
    const inteval = setInterval(async () => {
      const txList = await getTxHistory();
      const index = txList.findIndex((e) => e.status === 'PENDING');
      if (index >= 0) {
        await dispatch(setTransactions(txList));
      } else {
        await dispatch(setTransactions(txList));
        clearInterval(inteval);
      }
      await setInfor();
    }, 30000);
  };

  const setInfor = async () => {
    const accountList = await AccountList();
    const accountInfor = await getAccountInfors();
    const updatedInferredNonce =
      accountInfor.inferredNonce == inferredNonce
        ? (Number(accountInfor.inferredNonce) + 1).toString()
        : accountInfor.inferredNonce;
    dispatch(setListAccounts(accountList));
    dispatch(
      setActiveAccount({
        activeAccount: accountInfor.publicKey as string,
        balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
        accountName: accountInfor.name as string,
        inferredNonce: updatedInferredNonce as string,
      }),
    );
  };

  const handleSend = async () => {
    if (loadingSend) return;
    setLoadingSend(true);

    await SendTransaction(txInfoProp)
      .then(async () => {
        const txList = await getTxHistory();
        dispatch(setTransactions(txList));
        await setInfor();
        interval;

        closeSucces();
      })
      .catch((e: any) => {
        const message = getRealErrorMsg(e.message);
        setMessage(message);
        setOpenToastMsg(true);
        // dispatch(setIsLoading(false));
        setLoadingSend(false);
      })
      .finally(() => {
        setLoadingSend(false);
        interval();
      });
  };
  return (
    <Modal
      open={open}
      title="Transaction Details"
      clickOutSide={clickOutSide}
      setOpenModal={setOpenModal}
      txInfoProp={txInfoProp}
      fixedwitdth={true}
      isClose={true}
    >
      <WTransactionConfirm>
        <BoxAmount>
          <TitleAmount>Amount</TitleAmount>
          <Amount>{txInfoProp?.amount} MINA</Amount>
        </BoxAmount>
        <BoxInfo>
          To
          <Content>{txInfoProp?.to}</Content>
        </BoxInfo>
        <BoxInfo>
          From
          <Content>{activeAccount}</Content>
        </BoxInfo>
        <BoxInfo>
          Fee
          <Content>{toPlainString(txInfoProp?.fee)} MINA</Content>
        </BoxInfo>
        {!!txInfoProp.nonceValue && (
          <BoxInfo>
            Nonce
            <Content>{txInfoProp.nonce}</Content>
          </BoxInfo>
        )}
        {txInfoProp?.memo && (
          <BoxInfo>
            Memo
            <Content>{txInfoProp.memo}</Content>
          </BoxInfo>
        )}
        <ButtonConfirm onClick={handleSend} disable={loadingSend}>
          {loadingSend ? <CircleLoading className="circle-loading" /> : `Confirm`}
        </ButtonConfirm>
        <Message
          autoHideDuration={5000}
          open={openToastMsg}
          onClose={() => setOpenToastMsg(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <ContentMessage>{message}</ContentMessage>
        </Message>
      </WTransactionConfirm>
    </Modal>
  );
};

const Modal = styled(ModalCommon)<ContainerProps>`
  max-height: 300px;
`;

const WTransactionConfirm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
`;

const BoxAmount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px 10px;
`;

const TitleAmount = styled.div`
  font-family: 'Inter Regular';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #767677;
`;

const Amount = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
  color: #000000;
`;

const BoxInfo = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  color: #767677;
  padding: 10px 0;
`;

const Content = styled.div`
  max-width: 100%;
  word-wrap: break-word;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
`;

const ButtonConfirm = styled(Button)<Props>`
  line-height: 14px;
  margin-top: 12px;
  border-color: transparent;
  background: ${(props) => (props.disable ? '#D9D9D9' : '#594AF1')};
  cursor: ${(props) => (props.disable ? 'wait' : 'pointer')};
`;

const CircleLoading = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 99rem;
  position: relative;
  margin: 0 auto;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    border: 2px solid transparent;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    animation: circleLoading 1s forwards infinite linear;
  }

  @keyframes circleLoading {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled(Snackbar)({
  '&.MuiSnackbar-root': {
    width: '275px',
    height: '34px',
    padding: '8px 4px',
    background: '#000000',
    borderRadius: '5px',
  },
  '&.MuiSnackbar-anchorOriginBottomCenter': {
    top: '47%',
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

export default ModalConfirm;
