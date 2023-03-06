import { DropdownStyled, Wrapper } from './style';
import 'react-dropdown/style.css';
import { Group, Option, ReactDropdownProps } from 'react-dropdown';
import { useDispatch } from 'react-redux';
import { useMinaSnap } from 'services';
import { useState } from 'react';
import { setActiveAccount, setIsLoadingSwitchNetWork, setListAccounts, setTransactions } from 'slices/walletSlice';
import { ethers } from 'ethers';

interface Props extends ReactDropdownProps {
  error?: boolean;
  options: (string | Group | Option)[];
  label?: string;
}

const DropDown = ({ disabled, error, options, label, ...otherProps }: Props) => {
  const dispatch = useDispatch();
  const { SwitchNetwork, AccountList, getAccountInfors, getTxHistory } = useMinaSnap();
  const [value, setValue] = useState('Devnet');

  const changeNetwork = async (e: Option) => {
    setValue(e.value);
    dispatch(
      setTransactions([]),
    );
    dispatch(setIsLoadingSwitchNetWork(true));
    await SwitchNetwork(e.value)
      .then(async () => {
        const accountList = await AccountList();
        const accountInfor = await getAccountInfors();
        const txList = await getTxHistory();
        dispatch(setTransactions(txList));
        dispatch(setListAccounts(accountList));
        dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey as string,
            balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei') as string,
            accountName: accountInfor.name as string,
          }),
        );
      })
      .finally(() => {
        dispatch(setIsLoadingSwitchNetWork(false));
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
        value={value}
        {...otherProps}
      />
    </Wrapper>
  );
};

export default DropDown;
