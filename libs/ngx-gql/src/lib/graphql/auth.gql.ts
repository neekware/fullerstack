import gql from 'graphql-tag';

// auth login
export const AuthLoginMutation = gql`
  mutation authLogin($input: UserCredentialsInput!) {
    authLogin(input: $input) {
      ok
      token
      message
    }
  }
`;

// auth register
export const AuthRegisterMutation = gql`
  mutation authRegister($input: UserCreateInput!) {
    authRegister(input: $input) {
      ok
      token
      message
    }
  }
`;

// auth refresh token (cookie must be valid)
export const AuthRefreshTokenMutation = gql`
  mutation authRefreshToken {
    authRefreshToken {
      ok
      token
      message
    }
  }
`;
