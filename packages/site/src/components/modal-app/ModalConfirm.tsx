import { Box, Snackbar } from '@mui/material';
import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React, { useState } from 'react';
import { useMinaSnap } from 'services';
import { setActiveAccount, setIsLoading, setListAccounts, setTransactions } from 'slices/walletSlice';
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

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const ModalConfirm = ({ open, clickOutSide, setOpenModal, txInfoProp, closeSucces }: ModalProps) => {
  const { SendTransaction, AccountList, getAccountInfors, getTxHistory } = useMinaSnap();
  const {inferredNonce, activeAccount } = useAppSelector((state) => state.wallet);

  const [message, setMessage] = useState('');
  const [openToastMsg, setOpenToastMsg] = useState(false);

  
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    dispatch(setIsLoading(true));
    // console.log('x', await SendTransaction(txInfoProp));
    
    await SendTransaction(txInfoProp)
      .then(async () => {
        const accountList = await AccountList();
        const accountInfor = await getAccountInfors();
        const txList = await getTxHistory();
        dispatch(setTransactions(txList));
        await dispatch(setListAccounts(accountList));
        dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey as string,
            balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
            accountName: accountInfor.name as string,
            inferredNonce: accountInfor.inferredNonce as string,
          }),
        );
        closeSucces();
      })
      .catch((e:any) => {
        const message = getRealErrorMsg(e.message);
        setMessage(message);
        setOpenToastMsg(true);
        dispatch(setIsLoading(false));
      })
      .finally(() => {
        dispatch(setIsLoading(false));
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
        {txInfoProp?.nonce != Number(inferredNonce) && (
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
        <ButtonConfirm onClick={handleSend}>Confirm</ButtonConfirm>
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

const ButtonConfirm = styled(Button)`
  margin-top: 12px;
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
