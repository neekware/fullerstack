import gql from 'graphql-tag';

// Used for login
export const AuthLoginMutation = gql`
  mutation authLogin($input: UserCredentialsInput!) {
    authLogin(input: $input) {
      ok
      token
      message
    }
  }
`;

// Used for register
export const AuthRegisterMutation = gql`
  mutation authRegister($input: UserCreateInput!) {
    authRegister(input: $input) {
      ok
      token
      message
    }
  }
`;
