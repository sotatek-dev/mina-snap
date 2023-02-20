import React from 'react';
import { Box, Modal, styled } from '@mui/material';

interface ModalInforProps {
  open: boolean;
  ActionsBack?: React.ReactChild;
  title?: string;
}

const Container = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  background: '#FFFFFF',
  left: '50%',
  maxHeight: '550px',
  transform: 'translate(-50%, -50%)',
  boxSizing: 'border-box',
  width: '322px',
  padding: '16px 0px',
  border: '1px solid #ECECF6',
  boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  '&:focus-visible': {
    outline: 'none',
  },
}));
const ContainerContent = styled(Box)(() => ({
  padding: '0px 13px',
}));

const BoxTitleModal = styled(Box)({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#000000',
});

const ModalInfor = ({ open, title, ActionsBack }: ModalInforProps) => {
  return (
    <Modal disableAutoFocus={true} open={open}>
      <Container sx={{ height: '100%' }}>
        <ContainerContent>
          <BoxTitleModal>
            {ActionsBack && ActionsBack}
            {title}
          </BoxTitleModal>
        </ContainerContent>
      </Container>
    </Modal>
  );
};
export default ModalInfor;
