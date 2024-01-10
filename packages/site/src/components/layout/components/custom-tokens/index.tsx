import { ethers } from 'ethers';
import { formatBalance } from 'helpers/formatAccountAddress';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useMinaSnap } from 'services';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { setCustomTokens } from 'slices/walletSlice';
import { Box } from '@mui/system';
import IZKTx from 'assets/icons/icon-ZK-Tx.png';
import { ENetworkName } from 'utils/constants';

const CustomTokens = () => {
  const { customTokens } = useAppSelector((state) => state.wallet);
  const { items: currentNetwork } = useAppSelector((state) => state.networks);
  const { getAccountInfors } = useMinaSnap();
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    const getListCustomTokens = () => {
      const tokenId = process.env.REACT_APP_CUSTOM_TOKEN_ID as string;
      setTimeout(async () => {
        if (currentNetwork.name === ENetworkName.BERKELEY) {
          const tokenAccount = await getAccountInfors(tokenId);
          reduxDispatch(setCustomTokens(
            [{
              tokenId,
              tokenSymbol: process.env.REACT_APP_CUSTOM_TOKEN_SYMBOL as string,
              balance: tokenAccount.balance
            }]
          ));
        } else {
          reduxDispatch(setCustomTokens(
            []
          ));
        }
      }, 5000);
    };
    getListCustomTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNetwork]);

  const paddingBt = {
    marginBottom: '20px',
  };
  return (
    <>
      <Wrapper>
        <CustomTokensList>
          {customTokens.length > 0 ? (
            customTokens.map((item, index) => {
              return (
                <CustomTokenItem
                  key={index}
                  onClick={() => {}}
                >
                  <Icon src={IZKTx} />
                  <div>
                    <TokenSymbol>{item.tokenSymbol}</TokenSymbol>
                    <TokenAmount>
                      {formatBalance(ethers.utils.formatUnits(item.balance.total, 'gwei'))} {item.tokenSymbol}
                    </TokenAmount>
                  </div>
                </CustomTokenItem>
              );
            })
          ) : (
            <BoxNoTokens sx={paddingBt}>You have no custom token</BoxNoTokens>
          )}
        </CustomTokensList>
      </Wrapper>
    </>
  );
};

const BoxNoTokens = styled(Box)(() => ({
  fontWeight: '400',
  fontSize: '12px',
  color: '#000000',
  opacity: '0.5',
  justifyContent: 'center',
  display: 'inline-flex',
  marginTop: '20px',
}));

const Wrapper = styled.div`
  margin-top: 15px;
`;

const Label = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #d9d9d9;
`;

const CustomTokensList = styled.div`
  text-align: center;
`;

const CustomTokenItem = styled.div`
  border-bottom: 1.6px solid #d9d9d9;
  display: flex;
  padding: 10px 10px;
  :hover {
    background: #f1f1f1;
  }
`;

const Icon = styled.img`
  max-width: 30px;
  object-fit: contain;
  padding-right: 14px;
`;

const TokenSymbol = styled.div`
  font-weight: 600;
  text-align: left;
`;

const TokenAmount = styled.div`
  justify-content: space-between;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.03em;
`;

export default CustomTokens;
