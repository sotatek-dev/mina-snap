import React from 'react';
import { Box, Modal, styled, ModalProps, LinearProgress } from '@mui/material';
import IconBack from 'assets/icons/icon-back.svg';
import { useAppSelector } from 'hooks/redux';

interface IModalCommon extends ModalProps {
  open: boolean;
  setOpenModal: () => void;
  ActionsBack?: React.ReactChild;
  title?: string;
  fixedheight?: boolean;
  clickOutSide?: boolean;
  fixedwitdth?: boolean;
}

type ModalCommonProps = React.PropsWithChildren<IModalCommon>;

type ContainerProps = React.PropsWithChildren<Omit<IModalCommon, 'open' | 'setOpenModal'>>;

const ModalCommon = ({
  open,
  title,
  setOpenModal,
  children,
  clickOutSide,
  fixedheight,
  fixedwitdth,
}: ModalCommonProps) => {
  const { isLoading } = useAppSelector((state) => state.wallet);
  return (
    <Modal
      onBackdropClick={() => {
        clickOutSide ? setOpenModal : '';
      }}
      disableAutoFocus={true}
      open={open}
    >
      <Container fixedwitdth={fixedwitdth} sx={{ height: fixedheight ? '100%' : 'auto' }}>
        <ContainerContent>
          <BoxTitleModal>
            <CloseIconWrapper onClick={setOpenModal}>
              <IconBoxBack>
                <img src={IconBack} />
              </IconBoxBack>
            </CloseIconWrapper>
            {title}
            {isLoading && <LinearProgressCustom />}
          </BoxTitleModal>
          {children}
        </ContainerContent>
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
  maxHeight: '550px',
  transform: 'translate(-50%, -50%)',
  boxSizing: 'border-box',
  width: Prop.fixedwitdth ? '310px' : '322px',
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
  fontWeight: '600',
  fontSize: '16px',
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

const LinearProgressCustom = styled(LinearProgress)({
  height: '2px !important',
  marginTop: '10px',
});

export default ModalCommon;
