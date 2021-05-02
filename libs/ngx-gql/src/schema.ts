/* eslint:disable */
//  This file was automatically generated and should not be edited.

// An enumeration.
export enum UserProfileStatus {
  active = 'active', // Active
  banned = 'banned', // Banned
  joining = 'joining', // Joining
  new = 'new', // New
  pending = 'pending', // Pending
  suspended = 'suspended', // Suspended
}

export interface EmailFoundQueryVariables {
  email: string;
}

export interface EmailFoundQuery {
  emailFound: boolean | null;
}

export interface JwtLoginMutationVariables {
  email: string;
  password: string;
}

export interface JwtLoginMutation {
  jwtLogin: {
    ok: boolean;
    msg: string | null;
    errno: string | null;
    token: string | null;
  } | null;
}

export interface JwtRegisterMutationVariables {
  firstName: string;
  lastName?: string | null;
  language?: string | null;
  email: string;
  password: string;
}

export interface JwtRegisterMutation {
  jwtRegister: {
    ok: boolean;
    msg: string | null;
    errno: string | null;
    token: string | null;
  } | null;
}

export interface JwtRefreshMutationVariables {
  token: string;
}

export interface JwtRefreshMutation {
  jwtRefresh: {
    ok: boolean;
    msg: string | null;
    errno: string | null;
    token: string | null;
  } | null;
}

export interface UserQueryVariables {
  id?: string | null;
  email?: string | null;
}

export interface UserQuery {
  user: {
    // The ID of the object.
    id: string;
    // Email address for account
    email: string;
    // User's first name
    firstName: string | null;
    // User's last name
    lastName: string | null;
    // If user is staff
    isStaff: boolean;
    // If user is superuser
    isSuperuser: boolean;
    // If user account is active
    isActive: boolean;
    // If user is verified
    isVerified: boolean;
    // User's selected language
    language: string;
    // User's account status
    status: UserProfileStatus;
  } | null;
}

export interface UserFragment {
  // The ID of the object.
  id: string;
  // Email address for account
  email: string;
  // User's first name
  firstName: string | null;
  // User's last name
  lastName: string | null;
  // If user is staff
  isStaff: boolean;
  // If user is superuser
  isSuperuser: boolean;
  // If user account is active
  isActive: boolean;
  // If user is verified
  isVerified: boolean;
  // User's selected language
  language: string;
  // User's account status
  status: UserProfileStatus;
}
