import { ethers } from 'ethers';
import { formatAccountAddress, formatBalance } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import ISendTx from 'assets/icons/icon-sent-tx.png';
import IReceivedTx from 'assets/icons/icon-received-tx.png';
import { formatDateTime } from 'helpers/formatDateTime';
import ModalTransactionDetail from 'components/modal-app/ModalTranstionDetail';
import { useEffect, useState } from 'react';
import { useMinaSnap } from 'services';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { setTransactions } from 'slices/walletSlice';
import { ResultTransactionList } from 'types/transaction';
import { Box } from '@mui/system';
import ILink from 'assets/icons/icon-link.svg';
import { MINA_BERKELEY_EXPLORER } from 'utils/constants';

interface Props {
  status: string;
}

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

  const hanldeViewAccount = () => {
    const type = 'wallet';
    window.open(MINA_BERKELEY_EXPLORER + type + '/' + activeAccount, '_blank')?.focus();
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

  const paddingBt = {
    paddingBottom: '20px',
  };

  return (
    <>
      <Wrapper>
        <Label>HISTORY</Label>
        <TransactionList>
          {transactions.length > 0 ? (
            transactions.slice(0,10).map((item, index) => {
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
                      <Address>
                        {item.from == activeAccount ? formatAccountAddress(item.to) : formatAccountAddress(item.from)}
                      </Address>
                      <Amount>
                        {(item.from == activeAccount ? `- ` : `+ `) +
                          formatBalance(ethers.utils.formatUnits(item.amount, 'gwei'))}
                      </Amount>
                    </TxInfo>
                    <Status>
                      {item.status == 'PENDING' ? (
                        <Detail>Nonce {item.nonce}</Detail>
                      ) : (
                        <Detail>{formatDateTime(item.dateTime)}</Detail>
                      )}
                      <TxStatus status={item.status}>{item.status}</TxStatus>
                    </Status>
                  </TransactionDetail>
                </TracsactionItem>
              );
            })
          ) : (
            <BoxNoTrans sx={paddingBt}>You have no transactions</BoxNoTrans>
          )}
          <ModalTransactionDetail
            open={showTxDetail}
            clickOutSide={true}
            setOpenModal={handleClickOutSideTxDetail}
            transaction={detailTx}
          />
        </TransactionList>
      </Wrapper>
      {transactions.length > 10 ? (
        <CheckmoreTx onClick={() => hanldeViewAccount()}>
          Check more transaction history
          <IconLink src={ILink} />
        </CheckmoreTx>
      ) : (
        ''
      )}
    </>
  );
};

const BoxNoTrans = styled(Box)(() => ({
  fontWeight: '400',
  fontSize: '12px',
  color: '#000000',
  opacity: '0.5',
  justifyContent: 'center',
  display: 'flex',
  paddingTop: '20px',
}));

const CheckmoreTx = styled.div`
  cursor: pointer;
  padding: 25px 0;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: -0.03em;
  color: #594af1;
`;
const IconLink = styled.img`
  padding-left: 6px;
`;

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
    background: #f1f1f1;
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
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Address = styled.div``;

const Amount = styled.div`
  font-weight: 500;
`;

const Detail = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.03em;
`;

const TxStatus = styled.div<Props>`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.03em;
  color: ${(props) => (props.status == 'PENDING' ? '#ECC307' : props.status == 'APPLIED' ? '#0DB27C' : '#D95A5A')};
  background: ${(props) => (props.status == 'PENDING' ? '#ECE8D7' : props.status == 'APPLIED' ? '#D5E7E4' : '#FBEEEE')};
`;

export default TransactionHistory;
