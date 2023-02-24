import styled from 'styled-components';
import mina from 'assets/logo/mina-sm.svg';
import logo from 'assets/logo/logo.png';
import DropdownCommon from 'components/common/dropdown';
import wallet from 'assets/icons/wallet.png';
import { OPTIONS_NETWORK } from 'utils/constants';
import { PopperTooltipView } from 'components/common/tooltip';
import ButtonCommon from 'components/common/button';
import iconCreate from 'assets/icons/icon-create.svg';
import iconImport from 'assets/icons/icon-import.svg';
import CardAccount from 'components/modules/CardAccount';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Box } from '@mui/material';
import React from 'react';
import { useMinaSnap } from 'services';
import ModalCommon from 'components/common/modal';
import CreatAccount from 'components/children/CreatAccount';
import { setActiveAccount } from 'slices/walletSlice';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.palette.grey.grey3};
  position: fixed;
  width: 1040px;
  height: 124px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  justify-content: space-between;
  @media (max-width: 1024px) {
    width: 896px;
  }
`;

const BoxLogo = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img.attrs(() => ({
  src: logo,
}))`
  padding-right: 4px;
  width: 32px;
`;

const Title = styled.img.attrs(() => ({
  src: mina,
}))``;

const WDropDown = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const DropDownNetwork = styled(DropdownCommon)`
  width: 170px;
  height: 32px;
`;

const AccountDetails = styled(PopperTooltipView)``;

const AccountDetailsContent = styled.div`
  font-family: 'Inter Regular';
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  line-height: 17px;
  font-size: 17px;
  color: #000;
  font-weight: 500;
  padding: 16px 0;
`;

const WAccount = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
`;

const WButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;
`;

const ButtonCreate = styled(ButtonCommon)`
  width: 118px;
  height: 34px;
  background: ${(props) => props.theme.palette.default.main};
  color: ${(props) => props.theme.palette.default.contrastText};
  font-size: ${(props) => props.theme.typography.p1.fontSize};
  font-weight: ${(props) => props.theme.typography.p1.fontWeight};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonImport = styled(ButtonCommon)`
  width: 118px;
  height: 34px;
  background: ${(props) => props.theme.palette.default.contrastText};
  color: ${(props) => props.theme.palette.default.main};
  font-size: ${(props) => props.theme.typography.p1.fontSize};
  font-weight: ${(props) => props.theme.typography.p1.fontWeight};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ICreate = styled.img.attrs(() => ({
  src: iconCreate,
}))`
  padding-right: 8px;
`;

const IImport = styled.img.attrs(() => ({
  src: iconImport,
}))`
  padding-right: 8px;
`;

const Wallet = styled.img.attrs(() => ({
  src: wallet,
}))`
  margin-left: 20px;
  :hover {
    cursor: pointer;
  }
`;

const Header = () => {
  const { ChangeAccount, getAccountInfors } = useMinaSnap();
  const { accounts, activeAccount } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = React.useState(false);

  const handleChangeAccount = async (item: any) => {
    const payload = {
      accountIndex: item.index,
      isImported: item.isImported,
    };
    await ChangeAccount(payload).then(async () => {
      try {
        const accountInfor = await getAccountInfors();
        dispatch(setActiveAccount(accountInfor.publicKey));
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <>
      <Wrapper>
        <BoxLogo>
          <Logo />
          <Title />
        </BoxLogo>
        <WDropDown>
          <DropDownNetwork options={OPTIONS_NETWORK} />
          <AccountDetails
            closeTrigger="click"
            offSet={[-140, 10]}
            content={
              <AccountDetailsContent>
                <Label>Account Management</Label>
                <WAccount>
                  {accounts.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        onClick={() => {
                          handleChangeAccount(item);
                        }}
                      >
                        <CardAccount
                          active={activeAccount === item.address}
                          data={item}
                          imported={item.isImported}
                        ></CardAccount>
                      </Box>
                    );
                  })}
                </WAccount>
                <WButton>
                  <ButtonCreate
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    <ICreate />
                    Create
                  </ButtonCreate>
                  <ButtonImport>
                    <IImport />
                    Import
                  </ButtonImport>
                </WButton>
              </AccountDetailsContent>
            }
          >
            <Wallet />
          </AccountDetails>
        </WDropDown>
      </Wrapper>
      <ModalCommon
        open={openModal}
        title="Account Name"
        setOpenModal={() => {
          setOpenModal(false);
        }}
      >
        <CreatAccount
          onCloseModal={(accounts) => {
            setOpenModal(false);
            dispatch(setActiveAccount(accounts.address));
          }}
        ></CreatAccount>
      </ModalCommon>
    </>
  );
};

export default Header;
