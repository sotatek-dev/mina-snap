import ModalCommon from "components/common/modal";
import styled from "styled-components";

interface ModalProps {
    open:boolean;
    clickOutSide: boolean;
    setOpenModal: () => void;
}

const Modal = styled(ModalCommon)<ModalProps>`
    max-height: 300px;
`;

const ModalConfirm = ({open,clickOutSide, setOpenModal}: ModalProps) => {
    return (
        <Modal
            open={open}
            title='Confirm Transaction  '
            clickOutSide={clickOutSide}
            setOpenModal={setOpenModal}
        >
            <></>
        </Modal>
    );
}

export default ModalConfirm;