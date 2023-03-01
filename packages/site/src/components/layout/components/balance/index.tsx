import styled from 'styled-components';
import IMinaCircle from 'assets/logo/logo-mina-circle.png';
import ISend from 'assets/icons/icon-send.png';
import ISign from 'assets/icons/icon-sign.png';
import React, { useState } from 'react';
import ModalTransfer from 'components/modal-app/ModalTransfer';
import { useAppSelector } from 'hooks/redux';
import { formatBalance } from 'helpers/formatAccountAddress';
import ModalSign from 'components/common/modal-sign';
import SignMessage from 'components/modal-app/SignMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #d9d9d9;
  margin-top: 8px;
  padding-top: 8px;
`;

const Logo = styled.img`
  max-width: 25px;
  margin-bottom: 20px;
`;

const AmountToken = styled.div`
  display: flex;
  align-items: baseline;
`;

const Amount = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  margin-right: 4px;
`;

const TokenName = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;
`;

const Action = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: space-between;
  margin-top: 16px;
`;

const Send = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #594af1;
  cursor: pointer;
`;

const IconSend = styled.img`
  max-width: 30px;
`;

const Sign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #594af1;
  cursor: pointer;
`;

const IconSign = styled.img`
  max-width: 30px;
`;

const Balance = () => {
  const [showModalSendToken, setShowModalSendToken] = useState(false);
  const { balance } = useAppSelector((state) => state.wallet);
  const [openModal, setOpenModalSign] = React.useState(false);

  const handleClick = () => {
    setShowModalSendToken(true);
  };
  const handleClickOutSide = () => {
    setShowModalSendToken(false);
  };
  return (
    <Wrapper>
      <Logo src={IMinaCircle} />
      <AmountToken>
        <Amount>{balance}</Amount>
        <TokenName>MINA</TokenName>
      </AmountToken>
      <Action>
        <Send onClick={handleClick}>
          <IconSend src={ISend} />
          Send
        </Send>
        <ModalTransfer open={showModalSendToken} clickOutSide={true} setOpenModal={handleClickOutSide} />
        <Sign
          onClick={() => {
            setOpenModalSign(true);
          }}
        >
          <IconSign src={ISign} />
          Sign
        </Sign>
      </Action>
      <ModalSign
        open={openModal}
        title={'Sign Custom Message'}
        setOpenModal={() => {
          setOpenModalSign(false);
        }}
      >
        <SignMessage
          onCloseModal={() => {
            setOpenModalSign(false);
          }}
        ></SignMessage>
      </ModalSign>
    </Wrapper>
  );
};

export default Balance;
