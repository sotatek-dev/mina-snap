import { Box, styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconMore from 'assets/icons/icon-more.svg';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useAppSelector } from 'hooks/redux';
import React, { useEffect } from 'react';
import { ResultAccountList } from 'types/account';
import ChangeAccountName from './ChangeAccountName';
import ModalCommon from 'components/common/modal';
import { useMinaSnap } from 'services';
import DataExportPrivateKey from './DataExportPrivateKey';

const DetailsAccount = () => {
  const { detailsAccount } = useAppSelector((state) => state.wallet);
  const [openChangeAccountName, setOpenChangeAccountName] = React.useState<boolean>(false);
  const [state, setState] = React.useState<ResultAccountList | undefined>(undefined);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [privateKey, setPrivateKey] = React.useState<string>('');
  const { ExportPrivateKey } = useMinaSnap();

  const handelExportPrivateKey = async () => {
    const res = await ExportPrivateKey({
      accountIndex: Number(detailsAccount?.index),
      isImported: detailsAccount?.isImported,
    });
    setPrivateKey(res.privateKey);
    setOpenModal(true);
  };

  useEffect(() => {
    setState(detailsAccount);
  }, [detailsAccount]);
  return (
    <>
      <Container>
        <BoxContentTitle>Account Address</BoxContentTitle>
        <BoxContentAddress>{state?.address}</BoxContentAddress>
        <DividerCustom />
        <ListCustom>
          <Item
            onClick={() => {
              setOpenChangeAccountName(true);
            }}
          >
            <ListItemTextCustom primary={'Account Name'} secondary={state?.name}></ListItemTextCustom>
            <ListItemAvatar sx={{ minWidth: '0px' }}>
              <img src={IconMore} />
            </ListItemAvatar>
          </Item>
          <Item onClick={handelExportPrivateKey}>
            <ListItemTextCustom primary={'Export Private Key'}></ListItemTextCustom>
            <ListItemAvatar sx={{ minWidth: '0px' }}>
              <img src={IconMore} />
            </ListItemAvatar>
          </Item>
        </ListCustom>
      </Container>
      <ChangeAccountName
        onChange={(value: ResultAccountList) => {
          setState(value);
        }}
        data={detailsAccount}
        onClose={() => {
          setOpenChangeAccountName(false);
        }}
        open={openChangeAccountName}
      ></ChangeAccountName>
      <ModalCommon
        open={openModal}
        title="Export Private Key"
        setOpenModal={() => {
          setOpenModal(false);
        }}
      >
        <DataExportPrivateKey
          onDone={() => {
            setOpenModal(false);
          }}
          address={state?.address}
          privateKey={privateKey}
        ></DataExportPrivateKey>
      </ModalCommon>
    </>
  );
};

const DividerCustom = styled(Divider)({
  paddingTop: '7px',
  marginBottom: '7px',
  '& .MuiListItem-button': {
    padding: 0,
  },
});

const ListCustom = styled(List)({
  paddingTop: '0px',
});

const Item = styled(ListItem)({
  padding: '0 16px',
  height: '40px',
  ':hover': {
    cursor: 'pointer',
    background: '#F1F1F1',
  },
});

const BoxContentTitle = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '10px',
  lineHeight: '12px',
  padding: '20px 16px 0',
  color: '#000000',
});

const BoxContentAddress = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '15px',
  padding: '4px 16px 0',
  color: '#000000',
  opacity: '0.4',
  wordWrap: 'break-word',
});

const ListItemTextCustom = styled(ListItemText)({
  '& .css-10hburv-MuiTypography-root': {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#000000',
    paddingBottom: '1px',
  },
  '& .css-83ijpv-MuiTypography-root': {
    fontFamily: 'Inter Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#000000',
    opacity: '0.4',
    wordWrap: 'break-word',
  },
});

const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  width: '295px',
  height: '494px',
}));

export default DetailsAccount;
