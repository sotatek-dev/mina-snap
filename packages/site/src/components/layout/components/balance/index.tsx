import styled from "styled-components"
import IMinaCircle from "assets/logo/logo-mina-circle.png";
import ISend from "assets/icons/icon-send.png";
import ISign from "assets/icons/icon-sign.png";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #D9D9D9;
    margin-top: 8px;
    padding-top: 8px;
`;

const Logo = styled.img`
    max-width: 25px;
    margin-bottom: 20px;
`;

const AmountToken = styled.div`
    display: flex;
    align-items: baseline;
`;

const Amount = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 44px;
    margin-right: 4px;
`;

const TokenName = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
`;

const Action = styled.div`

`;

const Send = styled.img`

`;

const Sign = styled.img`

`;

const Balance = () => {
    return(
        <Wrapper>
            <Logo src={IMinaCircle}/>
            <AmountToken>
                <Amount>8.8888</Amount>
                <TokenName>MINA</TokenName>
            </AmountToken>
            <Action>
                <Send src={ISend}></Send>
                Send
                <Sign src={ISign}></Sign>
                Sign
            </Action>
        </Wrapper>
    )
}

export default Balance