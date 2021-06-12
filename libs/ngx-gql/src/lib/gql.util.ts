import { DocumentNode, OperationDefinitionNode, print } from 'graphql';

import { GqlRequestBody } from './gql.model';

/**
 *
 * @param doc gql Document
 * @returns name of operation
 */
export function getOperationName(doc: DocumentNode): string | null {
  return (
    doc.definitions
      .filter((definition) => definition.kind === 'OperationDefinition' && definition.name)
      .map((x: OperationDefinitionNode) => x!.name!.value)[0] || null
  );
}

/**
 *
 * @param doc gql Document
 * @param variables gql variables
 * @returns body object ready for http post request
 */
export function makeGqlBody(
  doc: DocumentNode,
  variables: { [id: string]: any } = {}
): GqlRequestBody {
  const body: GqlRequestBody = {
    operationName: getOperationName(doc),
    query: print(doc),
    variables,
  };
  return body;
}
