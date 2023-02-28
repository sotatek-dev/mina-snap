import { ethers } from 'ethers';
import { formatAccountAddress } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import ISendTx from 'assets/icons/icon-sent-tx.png';
// import IReceivedTx from "assets/icons/icon-received-tx.png"
import { formatDateTime } from 'helpers/formatDateTime';
import ModalTransactionDetail from 'components/modal-app/ModalTranstionDetail';
import { useState } from 'react';

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

const TransactionHistory = () => {
  const [showTxDetail, setShowTxDetail] = useState(false);

  const handleClick = () => {
    setShowTxDetail(true);
  };

  const handleClickOutSideTxDetail = () => {
    setShowTxDetail(false);
  };

  const transactions = [
    {
      amount: 10000000000,
      dateTime: '2023-02-27T03:06:01Z',
      failureReason: null,
      fee: 1100000,
      from: 'B62qjqX25T9HpSYVewyZ1nwRjbX247jkfwSfd7TnwCVchUSXDR2aUJX',
      hash: '5JvHUDj8m2pzz6YyftN4MQaNPSLUBcH6ggrosfTeyAeAoYGHUavV',
      kind: 'PAYMENT',
      memo: 'E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH',
      nonce: 0,
      to: 'B62qpBKQpWymoaVtq7ADXWooW53P5Bk6AycnaJ36oWH3CgVGJFuQYyZ',
    },
    {
      amount: 50000000000,
      dateTime: '2023-02-27T03:03:01Z',
      failureReason: null,
      fee: 10000000,
      from: 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e',
      hash: '5JucNGMW9QCeQMfigxmUyrhhEkngcscWQTA96vAGDaKUvFdthVxC',
      kind: 'PAYMENT',
      memo: 'E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH',
      nonce: 110,
      to: 'B62qjqX25T9HpSYVewyZ1nwRjbX247jkfwSfd7TnwCVchUSXDR2aUJX',
    },
  ];
  return (
    <Wrapper>
      <Label>HISTORY</Label>
      <TransactionList>
        {transactions.map((item, index) => {
          return (
            <TracsactionItem key={index} onClick={handleClick}>
              <Icon src={ISendTx} />
              <TransactionDetail>
                <TxInfo>
                  <Address>{formatAccountAddress(item.to)}</Address>
                  <Amount>{ethers.utils.formatUnits(item.amount, 'gwei')}</Amount>
                </TxInfo>
                <Status>
                  <Detail>{formatDateTime(item.dateTime)}</Detail>
                  <TxStatus>APPLIED</TxStatus>
                </Status>
              </TransactionDetail>
            </TracsactionItem>
          );
        })}
        <ModalTransactionDetail open={showTxDetail} clickOutSide={true} setOpenModal={handleClickOutSideTxDetail} />
      </TransactionList>
    </Wrapper>
  );
};

export default TransactionHistory;
