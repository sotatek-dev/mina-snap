import styled from "styled-components";
import ISend from 'assets/icons/icon-send.png';
import { useState } from "react";
import SendZkTransaction from "./SendZkTransaction";


const ZkTransaction = () => {

    const [showModal, setShowModal] = useState(false);
    const handleClickOutSide = () => {
        setShowModal(false);
    };
    const onClickShowModal = () => {
        setShowModal(true);
}
 return (
    <>
        <ButtonSend
            onClick={() => onClickShowModal()}
        >
            <IconSend src={ISend} />
            <Lable>
                zkApp
            </Lable>
        </ButtonSend>
        <SendZkTransaction
            open={showModal}
            clickOutSide={true}
            setOpenModal={handleClickOutSide}
        />
    </>
 )
}

const ButtonSend = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #594af1;
  cursor: pointer;
  padding-left: 20px;
`;

const IconSend = styled.img`
  max-width: 30px;
  padding-bottom: 3px;
`;

const Lable = styled.div`
    width: 30px;
    display: inline-block;
`;

export default ZkTransaction