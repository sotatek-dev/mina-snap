import React from 'react';
import { Box, Modal, styled, ModalProps } from '@mui/material';
import IconBack from 'assets/icons/icon-back.svg';

interface IModalCommon extends ModalProps {
  open: boolean;
  ActionsBack?: React.ReactChild;
  title?: string;
  setOpenModal: () => void;
  fixedheight?: boolean;
  clickOutSide?: boolean;
}
type ModalCommonProps = React.PropsWithChildren<IModalCommon>;

const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
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
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#000000',
});

const CloseIconWrapper = styled(Box)({
  position: 'absolute',
  left: 15,
  alignSelf: 'flex-end',
  cursor: 'pointer',
});

const IconBoxBack = styled(Box)({
  '& img': {
    animation: 'rotation 2s infinite linear',
    width: '10px',
    height: '10px',
  },
});

const ModalCommon = ({ open, title, setOpenModal, children, clickOutSide, fixedheight }: ModalCommonProps) => {
  return (
    <Modal
      onBackdropClick={() => {
        clickOutSide ? setOpenModal : '';
      }}
      disableAutoFocus={true}
      open={open}
    >
      <Container sx={{ height: fixedheight ? '100%' : 'auto' }}>
        <ContainerContent>
          <BoxTitleModal>
            <CloseIconWrapper onClick={setOpenModal}>
              <IconBoxBack>
                <img src={IconBack} />
              </IconBoxBack>
            </CloseIconWrapper>
            {title}
          </BoxTitleModal>

          {children}
        </ContainerContent>
      </Container>
    </Modal>
  );
};
export default ModalCommon;
