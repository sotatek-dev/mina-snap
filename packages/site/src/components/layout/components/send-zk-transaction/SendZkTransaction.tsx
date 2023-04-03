import { TextField } from '@mui/material';
import Button from 'components/common/button';
import ModalCommon from 'components/common/modal';
import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  open: boolean;
  clickOutSide: boolean;
  setOpenModal: () => void;
}

type ContainerProps = React.PropsWithChildren<Omit<ModalProps, 'closeSucces'>>;

const SendZkTransaction = ({ open, clickOutSide, setOpenModal }: ModalProps) => {
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
            <Button>Send</Button>
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
