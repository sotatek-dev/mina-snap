import BigNumber from "bignumber.js";

export function toNonExponential(ExpNumber:any) {
    const num = new BigNumber(ExpNumber);
    return num.toFixed();
}

export function getDisplayAmount(number:any, fixed = 4) {
    if (isNaN(parseFloat(number)) || number === 0) {
        return '0.00';
    }
    let showAmount = new BigNumber(number).toFixed(fixed, 1).toString()
    return toNonExponential(showAmount)
}