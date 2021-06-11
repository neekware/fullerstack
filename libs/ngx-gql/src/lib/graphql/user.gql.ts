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
    role
    permissions
    groupId
  }
`;

export const UserSelfQuery = gql`
  query userSelf {
    userSelf {
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
