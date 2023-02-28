import { formatAccountAddress } from "helpers/formatAccountAddress";
import styled from "styled-components";
import ICoppy from "assets/icons/icon-coppy.svg";

const Wrapper = styled.div`
    text-align: center;
`;

const AccountName  = styled.div`
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
    color: #535A61;
`;

const IconCoppy = styled.img`
    padding-left: 5px;
    :hover {
        cursor: pointer;
    }
`;

const Address = () => {
    const walletAddress = 'B62qirBtNT55AAjbsLQ2dQ6iSkj92FUddY4jiCqRtMhyJWHBPSFSMh2';

    return (
        <Wrapper>
            <AccountName>
                Account 1
            </AccountName>
            <WalletAddress>
                {formatAccountAddress(walletAddress)}
                <IconCoppy
                    src={ICoppy}
                    onClick={()=> {navigator.clipboard.writeText(walletAddress)}}
                />
            </WalletAddress>
        </Wrapper>
    )
}

export default Address