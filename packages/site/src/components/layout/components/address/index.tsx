import { formatAccountAddress } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import ICoppy from 'assets/icons/icon-coppy.svg';
import { useAppSelector } from 'hooks/redux';

const Wrapper = styled.div`
  text-align: center;
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

const Address = () => {
  const { activeAccount, accountName } = useAppSelector((state) => state.wallet);

  return (
    <Wrapper>
      <AccountName>{accountName}</AccountName>
      <WalletAddress>
        {formatAccountAddress(activeAccount)}
        <IconCoppy
          src={ICoppy}
          onClick={() => {
            navigator.clipboard.writeText(activeAccount);
          }}
        />
      </WalletAddress>
    </Wrapper>
  );
};

export default Address;
