import styled from 'styled-components';
import IMinaCircle from 'assets/logo/logo-mina-circle.png';
import ISend from 'assets/icons/icon-send.png';
import ISign from 'assets/icons/icon-sign.png';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ModalTransfer from 'components/modal-app/ModalTransfer';
import { useAppSelector, useAppDispatch } from 'hooks/redux';
import { setActiveAccount } from 'slices/walletSlice';
import { useMinaSnap } from 'services/useMinaSnap';

import ModalSign from 'components/common/modal-sign';
import SignMessage from 'components/modal-app/SignMessage';
import { formatBalance } from 'helpers/formatAccountAddress';
import ZkTransaction from '../send-zk-transaction';
import { ENetworkName } from 'utils/constants';

const Balance = () => {
  const reduxDispatch = useAppDispatch();
  const [showModalSendToken, setShowModalSendToken] = useState(false);
  const { getAccountInfors } = useMinaSnap();
  const { balance } = useAppSelector((state) => state.wallet);
  const { items } = useAppSelector((state) => state.networks)
  const [openModal, setOpenModalSign] = React.useState(false);

  const handleClick = () => {
    setShowModalSendToken(true);
  };

  const handleClickOutSide = () => {
    setShowModalSendToken(false);
  };

  const getBalance = async () => {
    const accountInfor = await getAccountInfors();
    reduxDispatch(
      setActiveAccount({
        activeAccount: accountInfor.publicKey as string,
        balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
        accountName: accountInfor.name as string,
        inferredNonce: accountInfor.inferredNonce as string,
      }),
    );
  };

  useEffect(() => {
    const intervalID = (window as any).setInterval(function () {
      getBalance();
    }, 30000);
    return () => {
      (window as any).clearInterval(intervalID);
    };
  }, []);

  return (
    <Wrapper>
      <Logo src={IMinaCircle} />
      <AmountToken>
        <Amount>{formatBalance(balance)}</Amount>
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
        {(items?.name == ENetworkName.DEVNET) && <ZkTransaction/>}
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #d9d9d9;
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
  max-width: 120px;
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
  padding-right: 20px;
`;

const IconSend = styled.img`
  max-width: 30px;
  padding-bottom: 3px;
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
  padding-bottom: 3px;
`;

export default Balance;
