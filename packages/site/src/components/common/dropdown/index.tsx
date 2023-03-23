import { DropdownStyled, Wrapper } from './style';
import 'react-dropdown/style.css';
import { Group, Option, ReactDropdownProps } from 'react-dropdown';
import { useDispatch } from 'react-redux';
import { useMinaSnap } from 'services';
import { setActiveAccount, setIsLoadingGlobal, setListAccounts, setTransactions } from 'slices/walletSlice';
import { ethers } from 'ethers';
import { setNetworks } from 'slices/networkSlice';
import { useAppSelector } from 'hooks/redux';

interface Props extends ReactDropdownProps {
  error?: boolean;
  options: (string | Group | Option)[];
  label?: string;
}

const DropDown = ({ disabled, error, options, ...otherProps }: Props) => {
  const dispatch = useDispatch();
  const { SwitchNetwork, AccountList, getAccountInfors, getTxHistory, GetNetworkConfigSnap } = useMinaSnap();
  const {items} = useAppSelector((state)=> (state.networks))

  const changeNetwork = async (e: Option) => {
    dispatch(setIsLoadingGlobal(true));
    dispatch(setTransactions([]));
    dispatch(setListAccounts([]));
    dispatch(
      setActiveAccount({
        activeAccount: '',
        balance: '',
        accountName: '',
        inferredNonce: '',
      }),
    );

    await SwitchNetwork(e.value)
      .then(async () => {
        const accountList = await AccountList();
        const accountInfor = await getAccountInfors();
        const txList = await getTxHistory();
        const network = await GetNetworkConfigSnap();
        dispatch(setNetworks(network));
        await dispatch(setTransactions(txList));
        await dispatch(setListAccounts(accountList));
        await dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey as string,
            balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
            accountName: accountInfor.name as string,
            inferredNonce: accountInfor.inferredNonce as string,
          }),
        );
        dispatch(setIsLoadingGlobal(false));
      })
      .finally(() => {
        dispatch(setIsLoadingGlobal(false));
      });
  };

  return (
    <Wrapper>
      <DropdownStyled
        
        onChange={(e) => {
          changeNetwork(e);
        }}
        error={error}
        disabled={disabled}
        options={options}
        value={items.name}
        placeholder='Mainnet'
        {...otherProps}
      />
    </Wrapper>
  );
};

export default DropDown;
