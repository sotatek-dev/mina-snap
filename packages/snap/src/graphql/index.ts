import {
  getTxSend,
  getTxSendWithRawSignature,
  getTxSendWithScalarField,
} from './gqlparams';

export const _getGQLVariables = (payload, signature, includeAmount = true) => {
  const isRawSignature = Boolean(signature.rawSignature);
  const variables: any = {
    fee: payload.fee,
    to: payload.to,
    from: payload.from,
    nonce: payload.nonce,
    memo: payload.memo || '',
    validUntil: payload.validUntil,
  };
  if (includeAmount) {
    variables.amount = payload.amount;
  }

  if (isRawSignature) {
    variables.rawSignature = signature.rawSignature;
  } else {
    variables.field = signature.field;
    variables.scalar = signature.scalar;
  }

  for (const pro in variables) {
    if ({}.hasOwnProperty.call(variables, pro)) {
      variables[pro] = String(
        typeof variables[pro] === 'undefined' ? '' : variables[pro],
      );
    }
  }
  return variables;
};

export const sendTx = async (payload, signature) => {
  const variables = _getGQLVariables(payload, signature, true);
  const txBody = getTxSend(!!variables.rawSignature);
  const res = await startFetchMyMutation('sendTx', txBody, variables);
  return res;
};
