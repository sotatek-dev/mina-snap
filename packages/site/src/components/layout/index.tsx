import Button from 'components/common/button';
import ModalTransfer from 'components/modal-app/ModalTransfer';
import { useState } from 'react';
import styled from 'styled-components';
import Header from './header';


const Wrapper = styled.div`
  background-color: ${(props) => props.theme.palette.grey.grey3};
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const ColMiddle = styled.div`
  max-width: 1040px;
  max-height: 100vh;
  margin: auto;
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
  height: 9999px;
  padding-top: 124px;

`;


 const Home = () => {

  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true)
    

  }
  const handleClickOutSide = () => {
    setShowModal(false)

  }
  return (
    <Wrapper>
        <Header />
        <ColMiddle>
            <Content>
              <Button onClick={handleClick}>Click</Button>
            <ModalTransfer
              open={showModal}
              clickOutSide={true}
              setOpenModal={handleClickOutSide}
            />
            </Content>
        </ColMiddle>
    </Wrapper>
  );
};

export default Home;