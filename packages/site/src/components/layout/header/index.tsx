import styled from "styled-components";
import mina from 'assets/logo/mina-sm.svg';
import logo from 'assets/logo/logo.png';
import DropdownCommon from 'components/common/dropdown';
import wallet from 'assets/icons/wallet.png';
import { OPTIONS_NETWORK } from 'utils/constants';
import { PopperTooltipView } from "components/common/tooltip";
import ButtonCommon from "components/common/button";
import iconCreate from "assets/icons/icon-create.svg";
import iconImport from "assets/icons/icon-import.svg";
import CardAccount from "components/modules/CardAccount";

interface CardAccount {
  active?:boolean;
}


const Wrapper = styled.div`
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

const DropDownNetwork = styled(DropdownCommon)`
    width: 170px;
    height: 32px;
`;

const AccountDetails = styled(PopperTooltipView)`
`;

const AccountDetailsContent = styled.div`
  font-family: 'Inter Regular';
  display: flex;
  flex-direction: column;
  
`;

const Label = styled.div`
  line-height: 17px;
  font-size: 17px;
  color: #000;
  font-weight: 500;
  padding: 16px 0;
`

const WAccount = styled.div`
  max-height: 300px;
  overflow-y: scroll;
  padding: 16px;
`


const WButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;
`;


const ButtonCreate = styled(ButtonCommon)`
  width: 118px;
  height: 34px;
  background:  ${(props) => props.theme.palette.default.main};
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
  background:  ${(props) => props.theme.palette.default.contrastText};
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
`

const IImport = styled.img.attrs(() => ({
  src: iconImport,
}))`
  padding-right: 8px;
`


const Wallet = styled.img.attrs(() => ({
  src: wallet
}))`
  margin-left: 20px;
  :hover {
    cursor: pointer;
  }
`;
 

const Header = () => {
    return(
        <Wrapper>
            <BoxLogo >
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
                    <WAccount>
                      <CardAccount active imported></CardAccount>
                      <CardAccount ></CardAccount>
                      <CardAccount imported></CardAccount>
                    </WAccount>
                    <WButton>
                      <ButtonCreate>
                        <ICreate/>
                        Create
                      </ButtonCreate>
                      <ButtonImport>
                        <IImport/>
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
    )
}

export default Header;