import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import React from 'react';
import { useMinaSnap } from 'services';
import { setActiveAccount, setIsLoading, setListAccounts, setTransactions } from 'slices/walletSlice';
import styled from 'styled-components';
import { payloadSendTransaction } from 'types/transaction';

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
  
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    dispatch(setIsLoading(true));
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
      .catch((e) => {
        console.log(e);
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
          <Content>{txInfoProp?.fee} MINA</Content>
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
export default ModalConfirm;
