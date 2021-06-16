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
export const AuthIsEmailAvailable = gql`
  mutation isEmailAvailable($email: String!) {
    isEmailAvailable(email: $email) {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;
