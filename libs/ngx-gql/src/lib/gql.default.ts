/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { GqlConfig } from './gql.model';

export const GQL_CLIENT_NAME = 'gqlClient';
/**
 * Default configuration - GQL module
 */
export const DefaultGqlConfig: GqlConfig = {
  endpoint: '/graphql',
};

export const GqlOperationNameKey = 'operationName';
