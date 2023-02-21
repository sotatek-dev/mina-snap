import { Box, styled } from '@mui/material';
import React, { useState } from 'react';
import Modal from '../../common/modal';

const HomePage = () => {
  const { ethereum } = window as any;
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : 'local:http://localhost:8080/';
  const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : '*';

  const handleInstallWallet = () => {
    ethereum
      .request({
        method: 'wallet_enable',
        params: [
          {
            wallet_snap: { [snapId]: { version: snapVersion } },
          },
        ],
      })
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('not success');
      });
  };
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <div>HomePage</div>
      <button onClick={handleInstallWallet}>wallet enable</button>
      <button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        open modal
      </button>
      <Modal
        setOpenModal={() => {
          setOpenModal(false);
        }}
        title="Account Details"
        open={openModal}
      ></Modal>
    </div>
  );
};

export default HomePage;
