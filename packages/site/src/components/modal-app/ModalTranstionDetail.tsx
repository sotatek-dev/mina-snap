import Modal from "components/common/modal";
import styled from "styled-components";
import { MINA_BERKELEY_EXPLORER, TRANSACTION_STATUS } from "utils/constants";
import ILink from "assets/icons/icon-link.svg"
import { ethers } from "ethers";
import { ResultTransactionList } from "types/transaction";
import { formatDateTime } from "helpers/formatDateTime";

interface ModalProps {
    open:boolean;
    clickOutSide: boolean;
    setOpenModal: () => void;
    transaction?: ResultTransactionList | undefined
}

interface Props {
    status?: string;
}

const ModalTransactionDetail = ({open, clickOutSide, setOpenModal, transaction}: ModalProps) => {
    return (
        <Modal
            open={open}
            title="Transaction Details"
            clickOutSide={clickOutSide}
            setOpenModal={setOpenModal}
        >
            <Wrapper>
                <BoxIcon>
                    <Icon src={transaction?.status == "PENDING" ? TRANSACTION_STATUS.Pending : transaction?.status == "APPLIED" ? TRANSACTION_STATUS.Success : TRANSACTION_STATUS.Fail}></Icon>
                    <Status status={transaction?.status}>
                        {transaction?.status == "PENDING" ? "Wait" : transaction?.status == "APPLIED" ? "Success" : "Failed"}
                    </Status>
                </BoxIcon>
                <BoxInfo>
                Amount
                <Content>{ethers.utils.formatUnits(transaction?.amount || 0 , "gwei")} MINA</Content>
                </BoxInfo>
                <BoxInfo>
                    To
                    <Content>{transaction?.to}</Content>
                </BoxInfo>
                <BoxInfo>
                    From
                    <Content>{transaction?.from}</Content>
                </BoxInfo>
                <BoxInfo>
                    Fee
                    <Content>{ethers.utils.formatUnits(transaction?.fee || 0 , "gwei")} MINA</Content>
                </BoxInfo>
                {transaction?.status != "PENDING" && 
                <BoxInfo>
                    Time
                    <Content>{formatDateTime(transaction?.dateTime || '')}</Content>
                </BoxInfo>
                }
                <BoxInfo>
                    Nonce
                    <Content>{transaction?.nonce}</Content>
                </BoxInfo>
                <BoxInfo>
                    Transaction Hash 
                    <Content>{transaction?.hash}</Content>
                </BoxInfo>
                <QueryDetails href={MINA_BERKELEY_EXPLORER+'transaction/'+transaction?.hash} target="_blank">
                    Query Details
                    <IconLink src={ILink}/>
                </QueryDetails>
            </Wrapper>
        </Modal>
    )
}

const Wrapper = styled.div`
    max-width: 336px;
    padding: 0 22px;
`;

const BoxIcon = styled.div`
    text-align: center;
    margin-top: 32px;
    border-bottom: 1.6px solid #D9D9D9;
`;

const Icon = styled.img`
    max-width: 70px;
    margin-bottom: 14px;
`;

const Status = styled.div<Props>`
    color: ${(props)=> (props.status == 'PENDING'? '#ECC307': props.status == 'APPLIED' ? '#0DB27C' : '#D95A5A')};
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
    font-weight: 500;
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
    color: #594AF1;
    margin: 18px 0 4px;
`;

const IconLink = styled.img`
    padding-left: 6px;
`;

export default ModalTransactionDetail