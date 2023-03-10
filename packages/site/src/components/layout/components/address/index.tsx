import { formatAccountAddress } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import ICoppy from 'assets/icons/icon-coppy.svg';
import { useAppSelector } from 'hooks/redux';
import Button from 'components/common/button';
import IThreeDot from 'assets/icons/icon-kebab-menu.svg';
import { Box } from '@mui/material';
import { PopperTooltipView } from 'components/common/tooltip';
import ILink from 'assets/icons/icon-link.svg';
import IAccount from 'assets/icons/icon-account.svg';
import { MINA_BERKELEY_EXPLORER } from 'utils/constants';
import DetailsAccout from 'components/children/DetailsAccoust';
import { useState } from 'react';
import ModalCommon from 'components/common/modal';
import { handelCoppy } from 'helpers/handleCoppy';

const Address = () => {
  const { activeAccount, accountName } = useAppSelector((state) => state.wallet);
  const [openModal, setOpenModal] = useState(false);

  const hanldeViewAccount = () => {
    const type = 'wallet';
    window.open(MINA_BERKELEY_EXPLORER + type + '/' + activeAccount, '_blank')?.focus();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <Wrapper>
      <BoxInfo>
        <AccountName>{accountName}</AccountName>
        <WalletAddress id="walletAddress" onClick={() => handelCoppy(activeAccount as string, '#walletAddress')}>
          {formatAccountAddress(activeAccount)}
          <IconCoppy src={ICoppy} />
        </WalletAddress>
      </BoxInfo>
      <KebabMenu
        closeTrigger="click"
        offSet={[50, 10]}
        content={
          <MenuContent>
            <MenuItem onClick={() => hanldeViewAccount()}>
              <IconLink src={ILink} />
              View Account on Minascan
            </MenuItem>
            <MenuItem onClick={() => handleOpenModal()}>
              <IconLink src={IAccount} />
              Account details
            </MenuItem>
          </MenuContent>
        }
      >
        <ButtonMenu typeButton="round">
          <PointMenu src={IThreeDot} />
        </ButtonMenu>
      </KebabMenu>
      <ModalCommon
        open={openModal}
        title="Account Details"
        setOpenModal={() => {
          setOpenModal(false);
        }}
        fixedheight={false}
        fixedwitdth={false}
      >
        <DetailsAccout></DetailsAccout>
      </ModalCommon>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  margin: 8px 0;
`;

const BoxInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 30px;
`;

const AccountName = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  padding: 8px 0 3px;
`;

const WalletAddress = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.03em;
  color: #535a61;
`;

const IconCoppy = styled.img`
  padding-left: 5px;
  :hover {
    cursor: pointer;
  }
`;
const KebabMenu = styled(PopperTooltipView)``;

const MenuContent = styled.div`
  width: 230px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 50px 70px -28px rgba(106, 115, 125, 0.2);
  padding: 18px 0;
  text-align: left;
`;

const MenuItem = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
  color: #000000;
  padding: 10px 18px;
  :hover {
    background: #f1f1f1;
    cursor: pointer;
  }
`;

const IconLink = styled.img`
  margin-right: 10px;
`;

const ButtonMenu = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #ffffff;
  border: none;
  margin-right: 8px;
  :hover {
    background: #d9d9d9;
  }
`;
const PointMenu = styled.img`
  text-align: center;
`;

export default Address;
