import { TextField } from '@mui/material';
import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import React from 'react';
import styled from 'styled-components';
import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  fetchAccount
} from 'snarkyjs';
// import type { Add } from '../../../../../public/smart-contract/Add'

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
}

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const SendZkTransaction = ({ open, clickOutSide, setOpenModal }: ModalProps) => {

  const submitZkTransaction = async () => { 
    console.log('-start');
    await isReady;
      const { Add } = await import('smart-contract'); 

      // Update this to use the address (public key) for your zkApp account
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to 
      // Berkeley Testnet B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
      const senderPrivateKey = 'EKEEPTX3EKjQBscJiNZoZEMgiTk87VNF7W9Ey5XFwtC9GEhj9yfQ';
      const senderAddress = 'B62qiwy4VoVLzBDdSC7dwN6agu6fe4QKqdzbFvWZ2dEmsiddX32A1tC';

      const zkAppPrivateKey = 'EKEfFXajzqebC4yEQzxaqaov9JgMMyeeAdNuuF84UVWVbzJrMjMh';
      // This should be removed once the zkAppAddress is updated.
      const zkAppAddress = 'B62qokxHiP7MGhmqztYdEbfXU7kqLztrKaDwftZ8ZiLM86mjYr2LNuT';

      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }
      const zkApp = new Add(PublicKey.fromBase58(zkAppAddress));
      console.log('zkApp', zkApp);
      
      Mina.setActiveInstance(Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql'));
      await Add.compile();
      const account = await fetchAccount({publicKey: zkAppAddress, ...zkApp}, 'https://proxy.berkeley.minaexplorer.com/graphql');
      console.log(`-account:`, account);
      let tx = await Mina.transaction({ sender: PublicKey.fromBase58(senderAddress), fee: 0.1e9 }, () => {
        zkApp.update();
      });
      console.log(`tx:`, tx);
      const provedTx = await tx.prove();
      console.log('send transaction...', provedTx);
      let sentTx = await tx.sign([PrivateKey.fromBase58(senderPrivateKey)]).send();
      console.log('sentTx:', sentTx);

      if (sentTx.hash() !== undefined) {
        console.log(`
      Success! Update transaction sent.
      
      Your smart contract state will be updated
      as soon as the transaction is included in a block:
      https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
      `);
      }

    console.log('-end');

  }
  return (
    <Modal
      open={open}
      title="Send Zk Transaction"
      clickOutSide={clickOutSide}
      setOpenModal={setOpenModal}
      isClose={true}
    >
        <Wrapper>
            <Content>
              <Input
                autoComplete="off"
                variant="outlined"
                placeholder="Param"
                fullWidth
                size="small"
                inputProps={{
                  style: {
                    height: '34px',
                    margin: '0 7px',
                    padding: '0px 0px',
                    fontSize: '10px',
                  },
                }}
              />
            </Content>
            <Button onClick={() => submitZkTransaction()}>Send</Button>
        </Wrapper>
    </Modal>
  );
};

const Modal = styled(ModalCommon)<ContainerProps>`
  max-height: 300px;
`;

const Content = styled.div`
  min-height: 150px;
  margin-top: 16px;
`;

const Wrapper = styled.div`
    width: 400px;
    height: 200px;
    padding: 0 16px;
`;

const Input = styled(TextField)`
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
`;

export default SendZkTransaction;
