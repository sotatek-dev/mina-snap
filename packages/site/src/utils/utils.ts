import { KeyboardEvent } from 'react';
import {
  TIMEOUT_DURATION,
} from './constants';
import axios from 'axios';

export const shortenAddress = (address: string, num = 3) => {
  if (!address) return '';
  return !!address && `${address.substring(0, num + 2)}...${address.substring(address.length - num - 1)}`;
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

export const getLatestSnapVersion =async () => {
  if (process.env.REACT_APP_SNAP_ID && /local:/.test(process.env.REACT_APP_SNAP_ID)) {
    return "*"
  }
  const packageName = process.env.REACT_APP_SNAP_ID?.slice(4);
  const url = `https://registry.npmjs.org/${packageName}/latest`;
  const version = await axios.get(url)
  .then( res => {
    const data = res.data;
    return data.version
  })
  .catch((error:any) => console.log(error))
  return version;
}
