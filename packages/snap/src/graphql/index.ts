import { NetworkConfig } from '../interfaces';
import { getOperationName } from '../util/helper';

/**
 * Send GraphQL request.
 *
 * @param networkConfig - Selected network config.
 * @param query - GraphQL query.
 * @param variables - GraphQL variables.
 */
export async function gql(
  networkConfig: NetworkConfig,
  query: string,
  variables = {},
) {
  try {
    const response = await fetch(networkConfig.gqlUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query,
        operationName: getOperationName(query),
        variables,
      }),
    });
    const { data, errors } = await response.json();
    if (errors) {
      return { error: errors[0].message };
    }

    return { data };
  } catch (err) {
    return { error: err.message };
  }
}
