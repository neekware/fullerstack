import gql from 'graphql-tag';

// Used for login
export const AuthLoginMutation = gql`
  mutation authLogin($email: String!, $password: String!) {
    authLogin(email: $email, password: $password) {
      ok
      token
      message
    }
  }
`;

// Used for registeration
export const AuthRegisterMutation = gql`
  mutation authSignup($email: String!, $password: String!, $firstName: String!, $lastName: String) {
    authSignup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      ok
      token
      message
    }
  }
`;
