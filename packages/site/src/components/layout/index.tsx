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
    width: 1040px;
    height: 124px;
    margin: auto;
    display:flex;
    justify-content: space-between;
    .box-logo {
        display:flex;
        align-items: center;
        height: 100%;
        .logo {
            padding-right: 4px;
            width: 32px;
        }
    }
    .drop-down {
        display:flex;
        align-items: center;
        height: 100%;
    }
    

    @media (max-width: 1024px) {
        width: 896px;
    }
`;

const ColMiddle = styled.div`
  width: 1040px;
  margin: auto;
  background-color: ${(props) => props.theme.palette.grey.white};


  @media (max-width: 1024px) {
    width: 896px;
  }
`;

const Content = styled.div`
  box-shadow: 0px 50px 70px -28px rgba(106, 115, 125, 0.2);
  border-radius: ${(props) => props.theme.corner.small};
  overflow: hidden;
`;

 const Home = ({ connected, children }: Props) => {
  const [bannerOpen, setBannerOpen] = useState(true);
  return (
    <Wrapper>
        <Header>
            <div className='box-logo'>
                <img className='logo' src={logo} alt="" />
                <img src={mina} alt="" />
            </div>
            <div className='drop-down'><DropDown options={OPTIONS_NETWORK}></DropDown></div>

        </Header>
        <ColMiddle>
            <Content>Cotent</Content>
        </ColMiddle>
    </Wrapper>
  );
};

export default Home;