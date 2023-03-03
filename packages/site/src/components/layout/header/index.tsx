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
import CreatNameAccount from 'components/children/CreatNameAccount';
import { setActiveAccount, setIsLoading } from 'slices/walletSlice';
import LinearProgress from '@mui/material/LinearProgress';
import { ResultCreateAccount } from 'types/account';
import DetailsAccoust from 'components/children/DetailsAccoust';
import { formatBalance } from 'helpers/formatAccountAddress';

const Wrapper = styled.div`
  font-family: 'Inter Regular';
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
  min-width: 300px;
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
  .disable {
    background-color: palegreen !important;
  }
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
const LinearProgressCustom = styled(LinearProgress)({
  height: '1px',
});
const Header = () => {
  const { ChangeAccount, getAccountInfors } = useMinaSnap();
  const { accounts, activeAccount, isLoading } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const [typeModal, setTypeModal] = React.useState('create');
  const [isShowDetail, setIsShowDetail] = React.useState(false);

  const handleChangeAccount = async (item: any) => {
    dispatch(setIsLoading(true));
    const payload = {
      accountIndex: item.index,
      isImported: item.isImported,
    };
    await ChangeAccount(payload)
      .then(async () => {
        try {
          const accountInfor = await getAccountInfors();
          dispatch(
            setActiveAccount({
              activeAccount: accountInfor.publicKey as string,
              balance: formatBalance(accountInfor.balance.total) as string,
              accountName: accountInfor.name as string,
            }),
          );
        } catch (error) {
          console.log(error);
        }
      })
      .finally(() => {
        dispatch(setIsLoading(false));
      });
  };

  const closeModal = (accounts: ResultCreateAccount) => {
    setOpenModal(false);
    dispatch(
      setActiveAccount({
        activeAccount: accounts.address as string,
        balance: '0',
        accountName: accounts.name as string,
      }),
    );
  };

  const handleClickCreat = () => {
    setIsShowDetail(false);
    setOpenModal(true);
    setTypeModal('create');
  };

  const handleClickImport = () => {
    setIsShowDetail(false);
    setOpenModal(true);
    setTypeModal('import');
  };

  const showDetails = () => {
    setIsShowDetail(true);
    setOpenModal(true);
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
                {isLoading && <LinearProgressCustom />}
                <WAccount className={isLoading ? 'disable' : ''}>
                  {accounts.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        onClick={() => {
                          handleChangeAccount(item);
                        }}
                      >
                        <CardAccount
                          handleShowDetail={showDetails}
                          active={activeAccount === item.address}
                          data={item}
                          imported={item.isImported}
                        ></CardAccount>
                      </Box>
                    );
                  })}
                </WAccount>
                <WButton>
                  <ButtonCreate className={isLoading ? 'disable' : ''} onClick={handleClickCreat}>
                    <ICreate />
                    Create
                  </ButtonCreate>
                  <ButtonImport className={isLoading ? 'disable' : ''} onClick={handleClickImport}>
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
        title={isShowDetail ? 'Account Details' : 'Account Name'}
        setOpenModal={() => {
          setOpenModal(false);
        }}
        fixedheight={isShowDetail}
      >
        {isShowDetail ? (
          <DetailsAccoust></DetailsAccoust>
        ) : (
          <CreatNameAccount
            type={typeModal}
            onCloseModal={(accounts) => {
              closeModal(accounts);
            }}
          ></CreatNameAccount>
        )}
      </ModalCommon>
    </>
  );
};

export default Header;
