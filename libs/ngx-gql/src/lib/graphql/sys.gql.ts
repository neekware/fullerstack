/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import gql from 'graphql-tag';

export const SystemStatusFragment = gql`
  fragment SystemStatus on SystemStatusDto {
    ok
    message
  }
`;

export const SystemContactUsMutation = gql`
  mutation systemContactUs($input: SystemContactUsInput!) {
    systemContactUs(input: $input) {
      ...SystemStatus
    }
  }
  ${SystemStatusFragment}
`;
