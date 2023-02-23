import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import Header from './header';

interface Props {
  connected: boolean;
  children?: ReactNode;
}

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

 const Home = ({ connected, children }: Props) => {
  return (
    <Wrapper>
        <Header />
        <ColMiddle>
            <Content>
              Content
            </Content>
        </ColMiddle>
    </Wrapper>
  );
};

export default Home;