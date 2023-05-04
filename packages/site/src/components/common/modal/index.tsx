import React from 'react';
import { Box, Modal, styled, ModalProps, LinearProgress } from '@mui/material';
import IconBack from 'assets/icons/icon-back.svg';
import close from 'assets/icons/close.svg';
import { useAppSelector } from 'hooks/redux';

interface IModalCommon extends ModalProps {
  open: boolean;
  setOpenModal: () => void;
  ActionsBack?: React.ReactChild;
  title?: string;
  fixedheight?: boolean;
  clickOutSide?: boolean;
  fixedwitdth?: boolean;
  isClose?: boolean;
}

type ModalCommonProps = React.PropsWithChildren<IModalCommon>;

type ContainerProps = React.PropsWithChildren<Omit<IModalCommon, 'open' | 'setOpenModal'>>;

type header = React.PropsWithChildren<Omit<ContainerProps, 'open' | 'setOpenModal' | 'children'>>;

const ModalCommon = ({
  open,
  title,
  setOpenModal,
  children,
  clickOutSide,
  fixedheight,
  isClose,
  fixedwitdth,
}: ModalCommonProps) => {
  const { isLoading } = useAppSelector((state) => state.wallet);
  return (
    <Modal
      onBackdropClick={() => {
        setOpenModal();
      }}
      disableAutoFocus={true}
      open={open}
    >
      <Container fixedwitdth={fixedwitdth} sx={{ height: fixedheight ? '100%' : 'auto' }}>
        <>
          {isClose ? (
            <BoxTitleModalIsClose>
              {title}
              <CloseIconWrapperIsClose onClick={setOpenModal}>
                <IconBoxBackClose>
                  <img src={close} />
                </IconBoxBackClose>
              </CloseIconWrapperIsClose>

              {isLoading && <LinearProgressCustom />}
            </BoxTitleModalIsClose>
          ) : (
            <BoxTitleModal>
              <CloseIconWrapper onClick={setOpenModal}>
                <IconBoxBack>
                  <img src={IconBack} />
                </IconBoxBack>
              </CloseIconWrapper>
              {title}
              {isLoading && <LinearProgressCustom />}
            </BoxTitleModal>
          )}

          {children}
        </>
      </Container>
    </Modal>
  );
};

const Container = styled(Box)<ContainerProps>((Prop) => ({
  fontFamily: 'Inter Regular',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  background: '#FFFFFF',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxSizing: 'border-box',
  width: Prop.fixedwitdth ? '310px' : 'auto',
  padding: '24px 0px 24px',
  border: '1px solid #ECECF6',
  boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  '&:focus-visible': {
    outline: 'none',
  },
}));

const IconBoxBackClose = styled(Box)({
  '& img': {
    animation: 'rotation 2s infinite linear',
    width: '14px',
    height: '14px',
  },
});

const BoxTitleModalIsClose = styled(Box)<header>((Prop) => ({
  padding: Prop.isClose ? '' : '0px 15px',
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '17px',
  display: 'flex',
  color: '#000000',
}));

const BoxTitleModal = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#000000',
});

const CloseIconWrapperIsClose = styled(Box)({
  position: 'absolute',
  right: 15,
  alignSelf: 'flex-end',
  cursor: 'pointer',
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

const LinearProgressCustom = styled(LinearProgress)({
  height: '2px !important',
  marginTop: '10px',
});

export default ModalCommon;
