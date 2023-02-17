import React, { useState } from 'react';
import { Box, Modal, styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconBack from 'assets/icons/icon-back.svg';
import IconMore from 'assets/icons/icon-more.svg';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

interface ModalAcctionsProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  contentTitle?: string;
  address?: string;
}

const Container = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  background: '#FFFFFF',
  left: '50%',
  height: '550px',
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

const CloseIconWrapper = styled(Box)({
  position: 'absolute',
  left: 3,
  alignSelf: 'flex-end',
  cursor: 'pointer',
});
const BoxTitleModal = styled(Box)({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#000000',
});

const BoxContentTitle = styled(Box)({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '10px',
  lineHeight: '12px',
  paddingTop: '17px',
  color: '#000000',
});
const BoxContentAddress = styled(Box)({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '15px',
  paddingTop: '4px',
  color: '#000000',
  opacity: '0.4',
  wordWrap: 'break-word',
});

const IconBoxBack = styled(Box)({
  '& img': {
    animation: 'rotation 2s infinite linear',
    width: '10px',
    height: '10px',
  },
});

const ListItemTextCustom = styled(ListItemText)({
  '& .css-10hburv-MuiTypography-root': {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#000000',
  },
  '& .css-83ijpv-MuiTypography-root': {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',

    color: '#000000',
    opacity: '0.4',
    wordWrap: 'break-word',
  },
});

const ModalAcctions = ({ open, onClose, title, contentTitle, address }: ModalAcctionsProps) => {
  const [openChangPass, setOpenChangPass] = useState(false);
  return (
    <Modal disableAutoFocus={true} open={open}>
      <Container>
        <ContainerContent>
          <BoxTitleModal>
            <CloseIconWrapper onClick={onClose}>
              <IconBoxBack>
                <img src={IconBack} />
              </IconBoxBack>
            </CloseIconWrapper>
            {title}
          </BoxTitleModal>
          <BoxContentTitle>{contentTitle}</BoxContentTitle>
          <BoxContentAddress>{address}</BoxContentAddress>
          <Divider sx={{ paddingTop: '7px', marginBottom: '7px' }} />
        </ContainerContent>
        <List sx={{ paddingTop: '0px', paddingBottom: '0px' }}>
          <ListItem button sx={{ padding: '0px 13px' }}>
            <ListItemTextCustom primary={'Name'} secondary={'Account 2'}></ListItemTextCustom>
            <ListItemAvatar sx={{ minWidth: '0px' }}>
              <img src={IconMore} />
            </ListItemAvatar>
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setOpenChangPass(true);
            }}
            sx={{ padding: '0px 13px' }}
          >
            <ListItemTextCustom primary={'Export Private Key'} secondary={'Account 2'}></ListItemTextCustom>
            <ListItemAvatar sx={{ minWidth: '0px' }}>
              <img src={IconMore} />
            </ListItemAvatar>
          </ListItem>
        </List>
      </Container>
    </Modal>
  );
};
export default ModalAcctions;
