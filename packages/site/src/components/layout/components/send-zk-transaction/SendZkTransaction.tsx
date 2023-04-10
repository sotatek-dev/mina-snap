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
  fetchAccount,
  Field
} from 'snarkyjs';
import { useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import { useEffect, useState } from 'react';

// import type { Add } from '../../../../../public/smart-contract/Add'

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
}

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const SendZkTransaction = ({ open, clickOutSide, setOpenModal }: ModalProps) => {

  const {activeAccount} = useAppSelector((state)=> (state.wallet));
  const { ExportPrivateKey } = useMinaSnap();
  const [currentState, setCurrentState] = useState('');
  const [newState, setNewState] = useState('');
  

  const submitZkTransaction = async () => { 
    const { Quiz } = await import('smart-contract'); 
    console.log('activeAccount', activeAccount);
    
    console.log('-start');
    await isReady;

      // Update this to use the address (public key) for your zkApp account
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to 
      // Berkeley Testnet B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
      
      const senderPrivateKey = 'EKEZvpJoapJyR8DH9zG1PTsrsdF56jdFS5yKLeoJUzagapGtX42t';
      const senderAddress = 'B62qqQXYTh8zAoSNS9Nf5mBkA2MxdC7WpbzMd6S1cwtNPzzwD582eDr';

      const zkAppPrivateKey = 'EKEfFXajzqebC4yEQzxaqaov9JgMMyeeAdNuuF84UVWVbzJrMjMh';
      // This should be removed once the zkAppAddress is updated.
      const zkAppAddress = 'B62qm3p1ZGw3xiWu4x6bfrF2FS4kj2bp1qrHkdM9rr9WscP3g6qNcb6';

      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }
      const zkApp = new Quiz(PublicKey.fromBase58(zkAppAddress));
      console.log('zkApp', zkApp);
      
      Mina.setActiveInstance(Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql'));
      await Quiz.compile();
      const account = await fetchAccount({publicKey: zkAppAddress, ...zkApp}, 'https://proxy.berkeley.minaexplorer.com/graphql');
      console.log(`-account:`, account);
      const zkState = zkApp.num.get().toString();
      console.log('zkState', zkState);
      console.log(Field(newState));
      let tx = await Mina.transaction({ sender: PublicKey.fromBase58(senderAddress), fee: 0.1e9 }, () => {
        zkApp.update(Field(newState));
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

  // useEffect(() => {
  //   const getCurrentState = async () => {
  //     const { Quiz } = await import('smart-contract'); 
  //     await isReady;
  //     const zkAppAddress = 'B62qrNT39BFhsqy85CCr4uemcfcgSxQVYf9hJHEYEzJ8Kf4U3bcgaGc';

  //     if (!zkAppAddress) {
  //       console.error(
  //         'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
  //       );
  //     }
  //     const zkApp = new Quiz(PublicKey.fromBase58(zkAppAddress));
  //     console.log('zkApp', zkApp);
      
  //     Mina.setActiveInstance(Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql'));
  //     await Quiz.compile();
  //     // const account = await fetchAccount({publicKey: zkAppAddress, ...zkApp}, 'https://proxy.berkeley.minaexplorer.com/graphql');
  //     // console.log(`-account:`, account);
  //     const zkState = zkApp.num.get().toString();
  //     console.log('zkState', zkState);
  //       setCurrentState(zkState);
  //   }
  //   getCurrentState()
  // }, [])
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
                onChange={(event) => {
                  setNewState(event.target.value);
                }}
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
            {currentState}
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
