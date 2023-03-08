import styled from 'styled-components';
import Address from './components/address';
import Balance from './components/balance';
import TransactionHistory from './components/transaction-history';
import Header from './header';
import ILink from "assets/icons/icon-link.svg"
import { MINA_BERKELEY_EXPLORER } from 'utils/constants';
import { useAppSelector } from 'hooks/redux';

 const Home = () => {
  const { activeAccount } = useAppSelector((state) => state.wallet);
  const hanldeViewAccount = () => {
    const type = 'wallet';
    window.open(MINA_BERKELEY_EXPLORER + type + '/' + activeAccount, '_blank')?.focus();
  }
  return (
    <Wrapper>
        <Header />
        <ColMiddle>
            <Content>
              <Address/>
              <Balance />
              <TransactionHistory/>
              <CheckmoreTx onClick={()=>hanldeViewAccount()}>
                Check more transaction history
                <IconLink src={ILink} />
              </CheckmoreTx>
            </Content>
        </ColMiddle>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.palette.grey.grey3};
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const ColMiddle = styled.div`
  font-family: "Inter Regular";
  max-width: 1040px;
  max-height: calc(100vh - 124px);
  margin: auto;
  margin-top: 124px;
  background-color: ${(props) => props.theme.palette.grey.white};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 1024px) {
    width: 896px;
  }
`;

const Content = styled.div`
  box-shadow: 0px 50px 70px -28px rgba(106, 115, 125, 0.2);
  border-radius: ${(props) => props.theme.corner.small};
`;

const CheckmoreTx = styled.div`
  padding: 25px 0;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: -0.03em;
  color: #594AF1;
`
const IconLink = styled.img`
  padding-left:  6px;
`
export default Home;