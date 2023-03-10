import styled from 'styled-components';
import Address from './components/address';
import Balance from './components/balance';
import TransactionHistory from './components/transaction-history';
import Header from './header';

 const Home = () => {
  return (
    <Wrapper>
        <Header />
        <ColMiddle>
            <Content>
              <Address/>
              <Balance />
              <TransactionHistory/>
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
  min-height: calc(100vh - 124px);
  box-shadow: 0px 50px 70px -28px rgba(106, 115, 125, 0.2);
  border-radius: ${(props) => props.theme.corner.small};
`;
export default Home;