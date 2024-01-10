import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { useAppSelector } from 'hooks/redux';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Address from './components/address';
import Balance from './components/balance';
import TransactionHistory from './components/transaction-history';
import Header from './header';
import CustomTokens from './components/custom-tokens';

const Home = () => {
  const { isLoadingGlobal, activeAccount } = useAppSelector((state) => state.wallet);
  const [activeTab, setActiveTab] = useState(2);

  const divRef = useRef(null as any);
  const scrollToTop = () => {
    divRef.current.scroll({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  useEffect(()=> {
    scrollToTop()
  }, [activeAccount])
  return (
    <Wrapper>
      <Header />
      <ColMiddle ref={divRef}>
        <Content>
          <Address />
          <Balance />
          <TabsWrapper>
            <TabButton active={activeTab === 1} onClick={() => handleTabClick(1)}>
              Custom Tokens
            </TabButton>
            <TabButton active={activeTab === 2} onClick={() => handleTabClick(2)}>
              History
            </TabButton>
          </TabsWrapper>
          <TabContent>
            { activeTab === 1 && <CustomTokens /> }
            { activeTab === 2 && <TransactionHistory /> }
          </TabContent>

        </Content>
      </ColMiddle>
      <Modal sx={{ outline: 'none' }} open={isLoadingGlobal}>
        <Container>
          <Box className="dot-loadding"></Box>
        </Container>
      </Modal>
    </Wrapper>
  );
};

const Container = styled(Box)({
  position: 'absolute',
  display: 'flex',
  top: '50%',
  background: 'unset',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: 20,
  '&:focus-visible': {
    outline: 'none',
  },
});

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.palette.grey.grey3};
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const ColMiddle = styled.div`
  font-family: 'Inter Regular';
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

const TabsWrapper = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
`;

const TabButton = styled.div<{active: boolean}>`
  padding: 10px;
  display: flex;
  justify-content: center;
  margin: 0;
  border-bottom: ${(props) => (props.active ? '3px solid #594af1' : 'none')};;
  cursor: pointer;
  width: 100%;
`;

const TabContent = styled.div``;

export default Home;
