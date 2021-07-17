/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import gql from 'graphql-tag';

export const AuthStatusFragment = gql`
  fragment AuthStatus on AuthStatusDto {
    ok
    message
  }
`;

export const AuthTokenStatusFragment = gql`
  fragment AuthTokenStatus on AuthTokenDto {
    ok
    token
    message
  }
`;

// auth login
export const AuthLoginMutation = gql`
  mutation authLogin($input: UserCredentialsInput!) {
    authLogin(input: $input) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth register
export const AuthRegisterMutation = gql`
  mutation authRegister($input: UserCreateInput!) {
    authRegister(input: $input) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth refresh token (cookie must be valid)
export const AuthRefreshTokenMutation = gql`
  mutation authRefreshToken {
    authRefreshToken {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth logout (cookie is cleared)
export const AuthLogoutMutation = gql`
  mutation authLogout {
    authLogout {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth email is not in use
export const AuthIsEmailAvailableQuery = gql`
  mutation isEmailAvailable($email: String!) {
    isEmailAvailable(email: $email) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify user
export const AuthVerifyUserMutation = gql`
  mutation authVerifyUser($input: UserVerifyInput!) {
    authVerifyUser(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth password reset request
export const AuthPasswordResetRequestMutation = gql`
  mutation authPasswordResetRequest($input: ChangePasswordRequestInput!) {
    authPasswordResetRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth password reset request verification
export const AuthVerifyPasswordResetRequestMutation = gql`
  mutation authVerifyPasswordResetRequest($input: VerifyPasswordResetRequestInput!) {
    authVerifyPasswordResetRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify user
export const AuthPasswordResetPerformMutation = gql`
  mutation authPasswordResetPerform($input: PerformPasswordResetInput!) {
    authPasswordResetPerform(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;
