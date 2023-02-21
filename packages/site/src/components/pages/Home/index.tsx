import React from 'react';
import ConnectWallet from 'components/connect-wallet/index';
import { useHasMetamaskFlask } from 'hooks/useHasMetamaskFlask';
import Home from 'components/layout/index';

const HomePage = () => {
  useHasMetamaskFlask();

  return (
    <div>
      {/* <ConnectWallet></ConnectWallet> */}
      <Home connected></Home>
    </div>
  );
};

export default HomePage;
