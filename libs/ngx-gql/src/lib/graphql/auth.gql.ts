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
export const AuthUserLoginMutation = gql`
  mutation authUserLogin($input: AuthUserCredentialsInput!) {
    authUserLogin(input: $input) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth logout (cookie is cleared)
export const AuthUserLogoutMutation = gql`
  mutation authUserLogout {
    authUserLogout {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth signup
export const AuthUserSignupMutation = gql`
  mutation authUserSignup($input: AuthUserSignupInput!) {
    authUserSignup(input: $input) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth refresh token (cookie must be valid)
export const AuthTokenRefreshMutation = gql`
  mutation authTokenRefresh {
    authTokenRefresh {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// auth email is not in use
export const AuthEmailVerifyAvailabilityQuery = gql`
  mutation authEmailVerifyAvailability($input: AuthEmailVerifyAvailabilityInput!) {
    authEmailVerifyAvailability(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify user
export const AuthUserVerifyMutation = gql`
  mutation authUserVerify($input: AuthUserVerifyInput!) {
    authUserVerify(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth verify current password
export const AuthPasswordVerifyQuery = gql`
  mutation authPasswordVerify($input: AuthPasswordVerifyInput!) {
    authPasswordVerify(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth change current password
export const AuthPasswordChangeMutation = gql`
  mutation authPasswordChange($input: AuthPasswordChangeInput!) {
    authPasswordChange(input: $input) {
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
export const AuthPasswordVerifyResetRequestMutation = gql`
  mutation authPasswordVerifyResetRequest($input: AuthPasswordVerifyResetRequestInput!) {
    authPasswordVerifyResetRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth password reset perform
export const AuthPasswordPerformResetMutation = gql`
  mutation authPasswordPerformReset($input: AuthPasswordPerformResetInput!) {
    authPasswordPerformReset(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth email change request
export const AuthEmailChangeRequestMutation = gql`
  mutation authEmailChangeRequest($input: AuthEmailChangeRequestInput!) {
    authEmailChangeRequest(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

// auth email change perform
export const AuthEmailChangePerformMutation = gql`
  mutation authEmailChangePerform($input: AuthEmailChangePerformInput!) {
    authEmailChangePerform(input: $input) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;
