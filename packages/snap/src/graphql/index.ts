import { getOperationName } from '../util/helper';

/**
 * Send GraphQL request.
 *
 * @param networkConfig - Selected network config.
 * @param query - GraphQL query.
 * @param variables - GraphQL variables.
 */
export async function gql(url: string, query: string, variables = {}) {
  try {
    const response = await fetch(url, {
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
    if (response.status !== 200) {
      throw new Error(`${url} response status code: ${response.status}. ${response.statusText}`)
    }
    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0].message);

    return data;
  } catch (err) {
    console.error('packages/snap/src/graphql/index.ts', err.message);
    throw err;
  }
}
