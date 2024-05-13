import { TextField, TextFieldProps, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  Mina,
  PublicKey,
  fetchAccount,
  Field
} from 'o1js';
import { useAppSelector } from 'hooks/redux';
import { useMinaSnap } from 'services';
import { useEffect, useState } from 'react';
import { payloadSendZkTransaction } from 'types/transaction';
import Info from'assets/icons/info.png'
import { AddOne } from '../../../../smart-contract/';
import { ENetworkName } from 'utils/constants';

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
}

interface Props {
  disable: boolean;
}

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const SendZkTransaction = ({ open, clickOutSide, setOpenModal }: ModalProps) => {

  const {activeAccount} = useAppSelector((state)=> (state.wallet));
  const { sendZkTransaction } = useMinaSnap();
  const [currentState, setCurrentState] = useState('');
  const [newState, setNewState] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");
  const [disableSend, setDisableSend] = useState(false);
  let zkAppAddress = process.env.REACT_APP_ZK_ADDRESS as string;
  const currentNetwork = useAppSelector((state) => state.networks).items.name;
  if (currentNetwork === ENetworkName.DEVNET) {
    zkAppAddress = process.env.REACT_APP_ZK_DEVNET_ADDRESS as string;
  }

  const graphqlUrl = useAppSelector((state)=> (state.networks)).items.gqlUrl;
  const submitZkTransaction = async () => {
      // Update this to use the address (public key) for your zkApp account
      // This should be removed once the zkAppAddress is updated.

      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }
      console.log('Compiling zkApp...');
      await AddOne.compile();
      console.log('zkApp compiled');

      const zkApp = new AddOne(PublicKey.fromBase58(zkAppAddress));
      console.log('zkApp', zkApp);

      Mina.setActiveInstance(Mina.Network(graphqlUrl));
      try {
        const account = await fetchAccount({publicKey: zkAppAddress});
        console.log(`-account:`, account);

      } catch (error) {
        console.log(error);
        setLoadingSend(false);

      }
      try {
        let tx = await Mina.transaction(async () => {
          await zkApp.update(Field(newState));
        });
        console.log(`tx:`, tx);
        // console.log(`tx:`, tx.toJSON());
        await tx.prove();
        const param: payloadSendZkTransaction = {
          transaction: tx.toJSON(),
          feePayer: {
            fee: '0.1',
            memo: "",
          }
        }
        const response = await sendZkTransaction(param);
        console.log('response', response);
        setMessage(JSON.stringify(response));
        setLoadingSend(false);
      } catch (error: any) {
        console.log('error', error);

        if(error.code){
          console.log(error);
          console.log(error.message);

          setMessage(error.message);
        }
        else{
          setMessage('{"error":{},"partiesJsonUpdate":null}');
        }
        setLoadingSend(false);
      }
  }

  const handleSendZKTransaction = () => {
    setLoadingSend(true);
    setTimeout(async() => {
      // await isReady
      submitZkTransaction()
    }, 500)
  }

  const checkCurrentState = async () => {
    if (!zkAppAddress) {
      console.error(
        'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
      );
    }
    const zkApp = new AddOne(PublicKey.fromBase58(zkAppAddress));
    console.log('zkApp', zkApp);

    Mina.setActiveInstance(Mina.Network(graphqlUrl));
    await AddOne.compile();
    try {
      const account = await fetchAccount({publicKey: zkAppAddress}, graphqlUrl);
      console.log(`-account:`, account);
    } catch (error) {
      console.log(error);
      setLoadingState(false);
    }
    const zkState = zkApp.num.get().toString();
    console.log('zkState', zkState);
    setCurrentState(zkState);
    setLoadingState(false);
    setShowModal(true);
  }

  const handleCheckCurrentState = () => {
    setLoadingState(true);
    setTimeout(async() => {
      // await isReady
      checkCurrentState()
    }, 500)
  }

  const handleClickOutSide = () => {
    setShowModal(false);
  };

  const Loader = () => {
    return(
      <CustomLoader>
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </CustomLoader>
    )
  }

  const onChangeValue = (event:any) => {

    setNewState(event.target.value)
  }

  useMemo(() => {
    if(newState == '') {
      setDisableSend(true);
    }
    else {
      setDisableSend(false);
    }
  }, [newState]);

  useEffect(() => {
    setCurrentState("");
    setNewState("");
    setMessage("");
  },[open])

  const tooltipTitle = () => {
    return (
      <p>
        <b>Correct state calculation formula</b> <br />
        <i>Correct state = The Current state plus one. <br />
            e.g.
            Current state (checked) = 1; <br />
            Correct state = 1 + 1 = 2<br />
          </i>
      </p>
    )
  }


  return (
    <Modal
      open={open}
      title="Send zkApp Transaction"
      clickOutSide={clickOutSide}
      setOpenModal={setOpenModal}
      // isClose={true}
    >
        <Wrapper>
            <Content>
              <Title>
                <Text>
                  Can you input the correct state?
                </Text>
                <CustomWidthTooltip title={tooltipTitle()}
                  arrow
                >
                  <IconInfo src={Info} alt="" />
                </CustomWidthTooltip>
              </Title>
              <Input
                autoComplete="off"
                variant="outlined"
                placeholder="Parameter"
                onChange={(event) => {
                  onChangeValue(event);
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
            <BoxButton>
              <CustomButton disable ={loadingSend || disableSend} onClick={handleSendZKTransaction}>{loadingSend ?<Loader/> : `Send`}</CustomButton>
              <CustomButton  disable ={loadingState} onClick={() => handleCheckCurrentState()}>{loadingState ?<Loader/> : `Check current state`}</CustomButton>
              <ModalCurrentState
                title='Current State'
                open={showModal}
                clickOutSide={true}
                // closeSucces={true}
                setOpenModal={handleClickOutSide}
              >

                <BoxContent>Current State: {currentState}</BoxContent>
              </ModalCurrentState>

            </BoxButton>
            <BoxResult>Send Result: {message}</BoxResult>

        </Wrapper>
    </Modal>
  );
};

const Modal = styled(ModalCommon)<ContainerProps>`
  max-height: 300px;
`;

const ModalCurrentState = styled(ModalCommon)`
`;

const Content = styled.div`
  min-height: 100px;
  margin-top: 16px;
`;

const Title = styled.div`
  padding-bottom: 20px;
  display: flex;
  align-items: center;
`
const Text = styled.div`
  margin-right: 8px;
`

const Wrapper = styled.div`
    width: 657px;
    min-height: 260px;
    padding: 0 16px;
`;

const Input = styled(TextField)<TextFieldProps>({
  backgroundColor: '#FFFFFF',
  width: '100%',
  borderRadius: '8px',
  input: {
    padding: '11px 7px',
    color: '#000000',
  },
  '& input': {
    fontSize: '10px',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#594AF1',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #594AF1',
    },
  },
});

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 277,
  },
});

const IconInfo = styled.img`
  height: 14px;
`;

const CustomButton = styled(Button)<Props>`
    max-width: 310px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: transparent;
    opacity: ${(props) => (props.disable ? '50%' : '100%')};
    cursor: ${(props) => (props.disable ? 'wait' : 'pointer')};
    pointer-events: ${(props) => (props.disable ? 'none' : '')};
`

const BoxButton = styled.div`
    display: flex;
    justify-content: space-between;

`

const BoxContent = styled.div`
  width: 500px;
  height: 100px;
  justify-content: center;
  display: flex;
  align-items: center;
`

const BoxResult = styled.div`
  width: 619px;
  min-height: 24px;
  background: #E2E3E5;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  margin-top: 20px;
  line-height: 20px;
  padding: 18px;
  overflow-y: scroll;
`

const CustomLoader = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  perspective: 800px;
  .inner {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .inner.one {
    left: 0%;
    top: 0%;
    animation: rotate-one 1s linear infinite;
    border-bottom: 3px solid #ff6bcb;
  }

  .inner.two {
    right: 0%;
    top: 0%;
    animation: rotate-two 1s linear infinite;
    border-right: 3px solid #ffb86c;
  }

  .inner.three {
    right: 0%;
    bottom: 0%;
    animation: rotate-three 1s linear infinite;
    border-top: 3px solid #2cccff;
  }

  @keyframes rotate-one {
    0% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
    }
  }

  @keyframes rotate-two {
    0% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
    }
  }

  @keyframes rotate-three {
    0% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
    }
  }
`

export default SendZkTransaction;
