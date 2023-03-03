import { ethers } from 'ethers';
import { formatAccountAddress } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import ISendTx from 'assets/icons/icon-sent-tx.png';
import IReceivedTx from "assets/icons/icon-received-tx.png"
import { formatDateTime } from "helpers/formatDateTime";
import ModalTransactionDetail from "components/modal-app/ModalTranstionDetail";
import { useEffect, useState } from "react";
import { useMinaSnap } from "services";
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { setTransactions } from 'slices/walletSlice';
import { ResultTransactionList } from 'types/transaction';

const TransactionHistory = () => {
  const [showTxDetail, setShowTxDetail] = useState(false);
  const [detailTx, setDetailTx] = useState<ResultTransactionList | undefined>(undefined);
  const { activeAccount, transactions } = useAppSelector((state) => state.wallet);

  const { getTxHistory } = useMinaSnap();
  const reduxDispatch = useAppDispatch();

  const handleClick = (item: ResultTransactionList) => {
    setDetailTx(item);
    setShowTxDetail(true);
  };

  const handleClickOutSideTxDetail = () => {
    setShowTxDetail(false);
  };

  useEffect(() => {
    const getListTxHistory = async () => {
      const txList = await getTxHistory();
      reduxDispatch(setTransactions(txList));
    };
    getListTxHistory();
  }, []);

  return (
    <Wrapper>
      <Label>HISTORY</Label>
      <TransactionList>
        {transactions.map((item, index) => {
          return (
            <TracsactionItem
              key={index}
              onClick={() => {
                handleClick(item);
              }}
            >
              <Icon src={item.from == activeAccount ? ISendTx : IReceivedTx} />
              <TransactionDetail>
                <TxInfo>
                  <Address>{formatAccountAddress(item.to)}</Address>
                  <Amount>
                    {(item.from == activeAccount ? `- ` : `+ `) + ethers.utils.formatUnits(item.amount, 'gwei')}
                  </Amount>
                </TxInfo>
                <Status>
                  <Detail>{formatDateTime(item.dateTime)}</Detail>
                  <TxStatus>APPLIED</TxStatus>
                </Status>
              </TransactionDetail>
            </TracsactionItem>
          );
        })}
        <ModalTransactionDetail
          open={showTxDetail}
          clickOutSide={true}
          setOpenModal={handleClickOutSideTxDetail}
          transaction={detailTx}
        />
      </TransactionList>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

const Label = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #000000;
`;

const TransactionList = styled.div``;

const TracsactionItem = styled.div`
  border-bottom: 1.6px solid #d9d9d9;
  display: flex;
  padding: 22px 15px;
  :hover {
    background: #F1F1F1;
    cursor: pointer;
  }
`;

const Icon = styled.img`
  max-width: 30px;
  object-fit: contain;
  padding-right: 14px;
`;

const TransactionDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TxInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Address = styled.div``;

const Amount = styled.div``;

const Detail = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.03em;
`;

const TxStatus = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.03em;
  color: #0db27c;
  background: #d5e7e4;
`;


export default TransactionHistory;