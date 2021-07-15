/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import gql from 'graphql-tag';

export const UserFragment = gql`
  fragment User on UserDto {
    id
    email
    isActive
    isVerified
    username
    firstName
    lastName
    language
    role
    permissions
    groupId
  }
`;

export const UserSelfQuery = gql`
  query userSelf($id: String!) {
    userSelf(id: $id) {
      ...User
    }
  }
  ${UserFragment}
`;

export const UserQuery = gql`
  query user($input: UserWhereByIdInput!) {
    user(input: $input) {
      ...User
    }
  }
  ${UserFragment}
`;

export const UserSelfUpdateMutation = gql`
  mutation userSelfUpdate($input: UserSelfUpdateInput!) {
    userSelfUpdate(input: $input) {
      ...User
    }
  }
  ${UserFragment}
`;
