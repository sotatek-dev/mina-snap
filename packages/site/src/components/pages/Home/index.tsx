import React, { useState } from 'react';
import Modal from '../../common/modal/ModalCommon';

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

  const CustomActions = (
    <button
      onClick={() => {
        alert('log xem chạy không');
      }}
    >
      open modal
    </button>
  );

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
        FooterButton={CustomActions}
        title="Account Details"
        address="B62qirBtNT55AAjbsLQ2dQ6iSkj92FUddY4jiCqRtMhyJWHBPSFSMh2"
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        contentTitle="Account Address"
      >
        ss
      </Modal>
    </div>
  );
};

export default HomePage;
