import Modal from 'components/common/modal';
import styled from 'styled-components';
import { TRANSACTION_STATUS } from 'utils/constants';
import ILink from 'assets/icons/icon-link.svg';
import { ethers } from 'ethers';
import { ResultTransactionList } from 'types/transaction';
import { formatDateTime } from 'helpers/formatDateTime';
import { formatBalance } from 'helpers/formatAccountAddress';

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
  transaction?: ResultTransactionList | undefined;
  explorerUrl?: string;
}

interface Props {
  status?: string;
}

const getStatus = (status: string | undefined) => {
  switch (status) {
    case 'PENDING':
      return TRANSACTION_STATUS.Pending;
    case 'APPLIED':
      return TRANSACTION_STATUS.Success;
    default:
      return TRANSACTION_STATUS.Fail;
  }
};

const ModalTransactionDetail = ({ open, clickOutSide, setOpenModal, transaction, explorerUrl }: ModalProps) => {
  return (
    <Modal open={open} title="Transaction Details" clickOutSide={clickOutSide} setOpenModal={setOpenModal}>
      <Wrapper>
        <BoxIcon>
          <Icon src={getStatus(transaction?.status)}></Icon>
          <Status status={transaction?.status}>
            {transaction?.status == 'PENDING' ? 'Wait' : transaction?.status == 'APPLIED' ? 'Success' : 'Failed'}
          </Status>
        </BoxIcon>
        <BoxInfo>
          Amount
          <Content>{formatBalance(ethers.utils.formatUnits(transaction?.amount || 0, 'gwei'))} MINA</Content>
        </BoxInfo>
        <BoxInfo>
          To
          <Content>{transaction?.receiver.publicKey}</Content>
        </BoxInfo>
        <BoxInfo>
          From
          <Content>{transaction?.source.publicKey}</Content>
        </BoxInfo>
        {transaction?.memo && (
          <BoxInfo>
            Memo
            <Content>{transaction?.memo}</Content>
          </BoxInfo>
        )}
        <BoxInfo>
          Fee
          <Content>{formatBalance(ethers.utils.formatUnits(transaction?.fee || 0, 'gwei'))} MINA</Content>
        </BoxInfo>
        {transaction?.status != 'PENDING' && (
          <BoxInfo>
            Time
            <Content>{formatDateTime(transaction?.dateTime || '')}</Content>
          </BoxInfo>
        )}
        <BoxInfo>
          Nonce
          <Content>{transaction?.nonce}</Content>
        </BoxInfo>
        <BoxInfo>
          Transaction Hash
          <Content>{transaction?.hash}</Content>
        </BoxInfo>
        <QueryDetails href={explorerUrl + 'tx/' + transaction?.hash} target="_blank">
          Query Details
          <IconLink src={ILink} />
        </QueryDetails>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  max-width: 336px;
  padding: 0 22px;
`;

const BoxIcon = styled.div`
  text-align: center;
  margin-top: 32px;
  border-bottom: 1.6px solid #d9d9d9;
`;

const Icon = styled.img`
  max-width: 70px;
  margin-bottom: 14px;
`;

const Status = styled.div<Props>`
  color: ${(props) => (props.status == 'PENDING' ? '#ECC307' : props.status == 'APPLIED' ? '#0DB27C' : '#D95A5A')};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
  margin-bottom: 23px;
`;

const BoxInfo = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  color: #767677;
  padding-top: 13px;
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

const QueryDetails = styled.a`
  display: flex;
  justify-content: center;
  text-decoration: none;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
  color: #594af1;
  margin: 18px 0 4px;
`;

const IconLink = styled.img`
  padding-left: 6px;
`;

export default ModalTransactionDetail;
