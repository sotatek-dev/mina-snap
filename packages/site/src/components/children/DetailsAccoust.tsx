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

const DetailsAccount = () => {
  const { detailsAccount } = useAppSelector((state) => state.wallet);
  const [openChangeAccountName, setOpenChangeAccountName] = React.useState<boolean>(false);
  const [state, setState] = React.useState<ResultAccountList | undefined>(undefined);

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
          <ListItem
            button
            onClick={() => {
              setOpenChangeAccountName(true);
            }}
          >
            <ListItemTextCustom primary={'Name'} secondary={state?.name}></ListItemTextCustom>
            <ListItemAvatar sx={{ minWidth: '0px' }}>
              <img src={IconMore} />
            </ListItemAvatar>
          </ListItem>
          <ListItem button onClick={() => {}}>
            <ListItemTextCustom primary={'Export Private Key'}></ListItemTextCustom>
          </ListItem>
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
const BoxContentTitle = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '10px',
  lineHeight: '12px',
  paddingTop: '17px',
  color: '#000000',
});
const BoxContentAddress = styled(Box)({
  fontFamily: 'Inter Regular',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '15px',
  paddingTop: '4px',
  color: '#000000',
  opacity: '0.4',
  wordWrap: 'break-word',
});
const ListItemTextCustom = styled(ListItemText)({
  '& .css-10hburv-MuiTypography-root': {
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
const Container = styled(Box)(() => ({
  fontFamily: 'Inter Regular',
  paddingTop: '16px',
  paddingLeft: '5px',
  paddingRight: '5px',
  paddingBottom: '0px',
}));

export default DetailsAccount;
