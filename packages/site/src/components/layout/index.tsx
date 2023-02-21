import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import mina from 'assets/logo/mina-sm.svg';
import logo from 'assets/logo/logo.png';
import DropDown from 'components/common/dropdown';
import { OPTIONS_NETWORK } from 'utils/constants';

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

const Header = styled.div`
    background-color: ${(props) => props.theme.palette.grey.grey3};
    position: fixed;
    width: 1040px;
    height: 124px;
    left: 50%;
    transform: translate(-50%, 0);
    display:flex;
    justify-content: space-between;
    @media (max-width: 1024px) {
        width: 896px;
    }
`;

const BoxLogo = styled.div`
  display:flex;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img.attrs(() => ({
  src: logo,
}))`
  padding-right: 4px;
  width: 32px;
`

const Title = styled.img.attrs(() => ({
  src: mina,
}))`
`

const WDropDown = styled.div`
  display:flex;
  align-items: center;
  height: 100%;
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
  const [bannerOpen, setBannerOpen] = useState(true);
  return (
    <Wrapper>
        <Header>
            <BoxLogo >
                <Logo />
                <Title />
            </BoxLogo>
            <WDropDown>
              <DropDown options={OPTIONS_NETWORK} />
            </WDropDown>
        </Header>
        <ColMiddle>
            <Content>
              Content
            </Content>
        </ColMiddle>
    </Wrapper>
  );
};

export default Home;