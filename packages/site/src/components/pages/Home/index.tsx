import React from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';

const HomePage = () => {
  useHasMetamaskFlask();

  return (
    <div>
      <ConnectWallet></ConnectWallet>
    </div>
  );
};

export default HomePage;
