import Modal from "components/common/modal";
import styled from "styled-components";
import { MINA_BERKELEY_EXPLORER, TRANSACTION_STATUS } from "utils/constants";
import ILink from "assets/icons/icon-link.svg"

interface ModalProps {
    open:boolean;
    clickOutSide: boolean;
    setOpenModal: () => void;
}

const Wrapper = styled.div``;

const BoxIcon = styled.div`
    text-align: center;
    padding: 24px 0 12px;
    border-bottom: 1.6px solid #D9D9D9;
    margin-bottom: 10px;
`;

const Icon = styled.img`
    max-width: 70px;
`;

const Status = styled.div`
    padding-top: 12px;
    color: #0DB27C;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: -0.03em;
`;

const BoxInfo = styled.div`
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 15px;
    color: #767677;
    padding: 4px 0;
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
    color: #594AF1;
    margin: 8px 0;
`;

const IconLink = styled.img`
    padding-left: 6px;
`;
const ModalTransactionDetail = ({open, clickOutSide, setOpenModal}: ModalProps) => {
    
    return (
        <Modal
            open={open}
            title="Transaction Details"
            clickOutSide={clickOutSide}
            setOpenModal={setOpenModal}
        >
            <Wrapper>
                <BoxIcon>
                    <Icon src={TRANSACTION_STATUS.Success}></Icon>
                    <Status>{Object.keys(TRANSACTION_STATUS)[0]}</Status>
                </BoxIcon>
                <BoxInfo>
                Amount
                <Content>10.8888 Mina</Content>
                </BoxInfo>
                <BoxInfo>
                    To
                    <Content>B62qiwy4VoVLzBDdSC7dwN6agu6fe4QKqdzbFvWZ2dEmsiddX32A1tC</Content>
                </BoxInfo>
                <BoxInfo>
                    From
                    <Content>B62qiwy4VoVLzBDdSC7dwN6agu6fe4QKqdzbFvWZ2dEmsiddX32A1tC</Content>
                </BoxInfo>
                <BoxInfo>
                    Fee
                    <Content>0.0101 MINA</Content>
                </BoxInfo>
                <BoxInfo>
                    Time
                    <Content>02-20-2023, 16:21:01 GMT +0700</Content>
                </BoxInfo>
                <BoxInfo>
                    Nonce
                    <Content>10</Content>
                </BoxInfo>
                <BoxInfo>
                    Transaction Hash 
                    <Content>CkpYafHzCXSr8nDZT7unf12eBmuLrSFN3u1udsFdzn7mg4scBNDhL</Content>
                </BoxInfo>
                <QueryDetails href={MINA_BERKELEY_EXPLORER} target="_blank">
                    Query Details
                    <IconLink src={ILink}/>
                </QueryDetails>
            </Wrapper>
        </Modal>
    )
}

export default ModalTransactionDetail