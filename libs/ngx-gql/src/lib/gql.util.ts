/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpHeaders } from '@angular/common/http';
import { DocumentNode, OperationDefinitionNode, print } from 'graphql';

import { GqlRequestBody, Variables } from './gql.model';

/**
 *
 * @param doc gql Document
 * @returns name of operation
 */
export function getOperationName(doc: DocumentNode): string | null {
  return (
    doc.definitions
      .filter((definition) => definition.kind === 'OperationDefinition' && definition.name)
      .map((x: OperationDefinitionNode) => x?.name?.value)[0] || null
  );
}

/**
 *
 * @param doc gql Document
 * @param variables gql variables
 * @returns body object ready for http post request
 */
export function createGqlBody<V = Variables>(doc: DocumentNode, variables?: V): GqlRequestBody {
  const body: GqlRequestBody = {
    operationName: getOperationName(doc),
    query: print(doc),
    variables,
  };
  return body;
}

/**
 * Returns a new or updates an existing headers object with no-cache added
 * @param headers caller's header
 * @returns headers with no-cache added
 */
export function createGqlHeaders(headers = {}): HttpHeaders {
  let httpHeaders = new HttpHeaders();

  for (const key of Object.keys(headers)) {
    httpHeaders = httpHeaders.append(key, headers[key]);
  }

  return httpHeaders
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Accept', 'application/json')
    .set('RequestFlavor', 'GQL');
}
