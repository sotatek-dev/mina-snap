import { KeyboardEvent } from 'react';
import { ethers } from 'ethers';
import {
  DECIMALS_DISPLAYED_MAX_LENGTH,
  MINA_MAINNET_EXPLORER,
  MINA_TESTNET_EXPLORER,
  MINA_BERKELEY_EXPLORER,
  TIMEOUT_DURATION,
} from './constants';
import { Erc20Token, Erc20TokenBalance } from 'types';
import { constants } from 'starknet';
import { formatBalance } from 'helpers/formatAccountAddress';

export const shortenAddress = (address: string, num = 3) => {
  if (!address) return '';
  return !!address && `${address.substring(0, num + 2)}...${address.substring(address.length - num - 1)}`;
};

export const openExplorerTab = (
  address: string,
  type = 'contract',
  chainId = constants.StarknetChainId.TESTNET as string,
) => {
  let explorerUrl = MINA_BERKELEY_EXPLORER;
  switch (chainId) {
    case constants.StarknetChainId.MAINNET:
      explorerUrl = MINA_MAINNET_EXPLORER;
      break;
    case constants.StarknetChainId.TESTNET:
      explorerUrl = MINA_BERKELEY_EXPLORER;
      break;
    case constants.StarknetChainId.TESTNET2:
      explorerUrl = MINA_TESTNET_EXPLORER;
      break;
  }
  window.open(explorerUrl + type + '/' + address, '_blank')?.focus();
};

export const isValidAddress = (toCheck: string) => {
  return /^0x[a-fA-F0-9]{63,64}$/.test(toCheck);
};

export const addMissingPropertiesToToken = (
  token: Erc20Token,
  balance?: string,
  usdPrice?: number,
): Erc20TokenBalance => {
  return {
    ...token,
    amount: ethers.BigNumber.from(balance ? balance : '0x0'),
    usdPrice: usdPrice,
  };
};

export const getHumanReadableAmount = (asset: Erc20TokenBalance) => {
  const amountStr = formatBalance(ethers.utils.formatUnits(asset.amount, asset.decimals));
  const indexDecimal = amountStr.indexOf('.');
  return ethers.utils
    .formatUnits(asset.amount, asset.decimals)
    .substring(0, indexDecimal + DECIMALS_DISPLAYED_MAX_LENGTH);
};

export const getAmountPrice = (asset: Erc20TokenBalance, assetAmount: number, usdMode: boolean) => {
  if (asset.usdPrice) {
    if (!usdMode) {
      const result = asset.usdPrice * assetAmount;
      return result.toFixed(2).toString();
    } else {
      const result = assetAmount / asset.usdPrice;
      return result.toFixed(getMaxDecimals(asset)).toString();
    }
  }
  return '';
};

export const getMaxDecimals = (asset: Erc20TokenBalance) => {
  const MAX_DECIMALS = 6;
  if (asset.decimals > MAX_DECIMALS) {
    return MAX_DECIMALS;
  }
  return asset.decimals;
};

export const isSpecialInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
  return (
    event.key === 'Backspace' ||
    event.ctrlKey ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft' ||
    event.metaKey
  );
};

export const fetchWithTimeout = async (resource: string, options = { timeout: TIMEOUT_DURATION }) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

export const isFlask = async () => {
  const provider = window.ethereum as any;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

export const blockInvalidChar = (e: any) => ['e', 'E', '+', '-',].includes(e.key) && e.preventDefault();

export const blockInvalidInt = (e: any) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

export const toPlainString = (num: number) => {
  return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + '0.' + Array(1 - e - c.length).join("0") + c + d
        : b + c + d + Array(e - d.length + 1).join("0");
    });
}

export const getRealErrorMsg =(error:any) => {
  let errorMessage = ""
  try {
      if (error.message) {
          errorMessage = error.message
      }
      if (Array.isArray(error) && error.length > 0) {
          // postError
          errorMessage = error[0].message
          // buildError
          if(!errorMessage && error.length > 1){
              errorMessage = error[1].c
          }
      }
      if (typeof error === 'string') {
          let lastErrorIndex = error.lastIndexOf("Error:")
          if (lastErrorIndex !== -1) {
              errorMessage = error.slice(lastErrorIndex)
          } else {
              errorMessage = error
          }
      }
  } catch (error) {
    console.log(error);
    
  }
  return errorMessage
}