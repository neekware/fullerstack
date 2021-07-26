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
  mutation authLogin($input: AuthUserCredentialsInput!) {
    authLogin(input: $input) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth register
export const AuthRegisterMutation = gql`
  mutation authRegister($input: AuthUserCreateInput!) {
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
export const AuthVerifyEmailAvailabilityQuery = gql`
  mutation authVerifyEmailAvailability($input: AuthEmailVerifyAvailabilityInput!) {
    authVerifyEmailAvailability(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify user
export const AuthVerifyUserMutation = gql`
  mutation authVerifyUser($input: AuthUserVerifyInput!) {
    authVerifyUser(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify current password
export const AuthVerifyCurrentPasswordQuery = gql`
  mutation authVerifyCurrentPassword($input: AuthPasswordVerifyInput!) {
    authVerifyCurrentPassword(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth password reset request
export const AuthPasswordResetRequestMutation = gql`
  mutation authPasswordResetRequest($input: AuthPasswordChangeRequestInput!) {
    authPasswordResetRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth password reset request verification
export const AuthVerifyPasswordResetRequestMutation = gql`
  mutation authVerifyPasswordResetRequest($input: AuthPasswordVerifyResetRequestInput!) {
    authVerifyPasswordResetRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify user
export const AuthPasswordResetPerformMutation = gql`
  mutation authPasswordResetPerform($input: AuthPasswordResetPerformInput!) {
    authPasswordResetPerform(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;
