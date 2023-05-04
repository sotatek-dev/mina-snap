import styled from 'styled-components';
import iconActive from 'assets/icons/icon-active.svg';
import ButtonCommon from 'components/common/button';
import pointMenu from 'assets/icons/pointMenu.svg';
import pointMenuDark from 'assets/icons/pointMenu_dark.svg';
import { ResultAccountList } from 'types/account';
import React from 'react';
import { formatAccountAddress, formatBalance } from 'helpers/formatAccountAddress';
import { useAppDispatch } from 'hooks/redux';
import { setDetailsAccount } from 'slices/walletSlice';
import { ethers } from 'ethers';

interface Props {
  active?: boolean;
  imported?: boolean;
  data?: ResultAccountList | null | undefined;
  handleShowDetail?: () => void;
}

const CardAccount: React.FC<Props> = ({ active, imported, data, handleShowDetail }: any) => {
  const dispatch = useAppDispatch();
  const showDetails: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(setDetailsAccount(data));
    handleShowDetail();
    event.stopPropagation();
  };

  return (
    <Wrapper active={active}>
      <AccountName active={active}>
        <Label>
          {data?.name}
          {data?.isImported && (
            <Imported active={active} imported={imported}>
              Imported
            </Imported>
          )}
        </Label>
        <IconActive active={active} />
      </AccountName>
      <Address active={active}>{data && formatAccountAddress(data.address)}</Address>
      <Balance active={active}>
        {data &&
          (data.balance.total > 0 ? formatBalance(ethers.utils.formatUnits(data.balance.total, 'gwei')) : 0) + ' '}
        MINA
        <More active={active} typeButton="round" onClick={showDetails}>
          <PointMenu src={active ? pointMenu : pointMenuDark} />
        </More>
      </Balance>
    </Wrapper>
  );
};

const Wrapper = styled.div<Props>`
  width: 270px;
  max-height: 88px;
  background: ${(props) => (props.active ? '#594AF1' : '#F9FAFC')};
  border: 1px solid ${(props) => (props.active ? '#594AF1' : '#D9D9D9')};
  border-radius: 8px;
  margin-top: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  :hover {
    cursor: ${(props) => (props.active ? 'default' : 'pointer')};
    border: 1px solid #594af1;
  }
`;

const AccountName = styled.div<Props>`
  line-height: 15px;
  color: ${(props) => (props.active ? '#FFFFFF' : '#000000')};
  font-weight: 600;
  font-size: 12px;
  padding: 3px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.div<Props>`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Imported = styled.div<Props>`
  display: ${(props) => (props.imported ? 'flex' : 'none')};
  width: 60px;
  height: 20px;
  align-items: center;
  font-size: 10px;
  line-heigh: 12px;
  weight: 500;
  justify-content: center;
  background: #0000001a;
  border-radius: 5px;
  margin-left: 3px;
`;
const IActive = styled.img.attrs(() => ({
  src: iconActive,
}))``;

const IconActive = styled(IActive)<Props>`
  display: ${(props) => (props.active ? 'flex' : 'none')};
`;

const Address = styled.div<Props>`
  line-height: 15px;
  color: ${(props) => (props.active ? '#D1CDEE' : '#535A61')};
  font-weight: 300;
  font-size: 12px;
  padding: 3px 0;
`;

const Balance = styled.div<Props>`
  line-height: 15px;
  color: ${(props) => (props.active ? '#FFFFFF' : '#000000')};
  font-weight: 300;
  font-size: 12px;
  padding: 3px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const More = styled(ButtonCommon)<Props>`
  z-index: 100;
  width: 30px;
  height: 30px;
  position: relative;
  background: ${(props) => (props.active ? '#594AF1' : '#F9FAFC')};
  border: solid 1px ${(props) => (props.active ? '#594AF1' : '#F9FAFC')};
  color: ${(props) => (props.active ? '#FFFFFF' : '#000000')};
  margin-right: -8px;
  :hover {
    background: #0000001a;
  }
`;

const PointMenu = styled.img<Props>`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
`;

export default CardAccount;
