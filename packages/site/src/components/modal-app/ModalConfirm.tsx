import Button from "components/common/button";
import ModalCommon from "components/common/modal";
import styled from "styled-components";

interface ModalProps {
    open:boolean;
    clickOutSide: boolean;
    setOpenModal: () => void;
    txInfoProp: object;
}

const Modal = styled(ModalCommon)<ModalProps>`
    max-height: 300px;
`;

const WTransactionConfirm = styled.div`
    display: flex;
    flex-direction: column;
`;

const BoxAmount = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0px;
`;

const TitleAmount = styled.div`
    font-family: 'Inter Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 15px;
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

const ModalConfirm = ({open,clickOutSide, setOpenModal, txInfoProp}: ModalProps) => {
    let txInfo: any = {};
    txInfo = txInfoProp
    
    return (
        <Modal
            open={open}
            title='Confirm Transaction  '
            clickOutSide={clickOutSide}
            setOpenModal={setOpenModal}
            txInfoProp={txInfoProp}
        >
            <WTransactionConfirm>
                <BoxAmount>
                    <TitleAmount>
                        Amount
                    </TitleAmount>
                    <Amount>
                        {txInfo.amount}
                    </Amount>
                </BoxAmount>
                <BoxInfo>
                    To
                    <Content>{txInfo.address}</Content>
                </BoxInfo>
                <BoxInfo>
                    From
                    <Content>1</Content>
                </BoxInfo>
                <BoxInfo>
                    Fee
                    <Content>{txInfo.fee} MINA</Content>
                </BoxInfo>
                {txInfo.nonce && <BoxInfo>
                    Nonce
                    <Content>{txInfo.nonce}</Content>
                </BoxInfo>}
                {txInfo.memo && <BoxInfo>
                    Memo
                    <Content>{txInfo.memo}</Content>
                </BoxInfo>}
                <Button>Confirm</Button>
            </WTransactionConfirm>
        </Modal>
    );
}

export default ModalConfirm;