/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authLogin
// ====================================================

export interface authLogin_authLogin {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authLogin {
  authLogin: authLogin_authLogin;
}

export interface authLoginVariables {
  input: UserCredentialsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authRegister
// ====================================================

export interface authRegister_authRegister {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authRegister {
  authRegister: authRegister_authRegister;
}

export interface authRegisterVariables {
  input: UserCreateInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authRefreshToken
// ====================================================

export interface authRefreshToken_authRefreshToken {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authRefreshToken {
  authRefreshToken: authRefreshToken_authRefreshToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authLogout
// ====================================================

export interface authLogout_authLogout {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authLogout {
  authLogout: authLogout_authLogout;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: isEmailAvailable
// ====================================================

export interface isEmailAvailable_isEmailAvailable {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface isEmailAvailable {
  isEmailAvailable: isEmailAvailable_isEmailAvailable;
}

export interface isEmailAvailableVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authVerifyUser
// ====================================================

export interface authVerifyUser_authVerifyUser {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authVerifyUser {
  authVerifyUser: authVerifyUser_authVerifyUser;
}

export interface authVerifyUserVariables {
  input: UserVerifyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authPasswordResetRequest
// ====================================================

export interface authPasswordResetRequest_authPasswordResetRequest {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authPasswordResetRequest {
  authPasswordResetRequest: authPasswordResetRequest_authPasswordResetRequest;
}

export interface authPasswordResetRequestVariables {
  input: ChangePasswordRequestInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userSelf
// ====================================================

export interface userSelf_userSelf {
  __typename: "UserDto";
  id: string;
  email: string | null;
  /**
   * User is active
   */
  isActive: boolean | null;
  /**
   * User is verified
   */
  isVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  language: string | null;
  role: Role | null;
  permissions: Permission[] | null;
  groupId: string | null;
}

export interface userSelf {
  /**
   * Get user's own info
   */
  userSelf: userSelf_userSelf;
}

export interface userSelfVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: user
// ====================================================

export interface user_user {
  __typename: "UserDto";
  id: string;
  email: string | null;
  /**
   * User is active
   */
  isActive: boolean | null;
  /**
   * User is verified
   */
  isVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  language: string | null;
  role: Role | null;
  permissions: Permission[] | null;
  groupId: string | null;
}

export interface user {
  /**
   * Get other user info
   */
  user: user_user;
}

export interface userVariables {
  input: UserWhereByIdInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userSelfUpdate
// ====================================================

export interface userSelfUpdate_userSelfUpdate {
  __typename: "UserDto";
  id: string;
  email: string | null;
  /**
   * User is active
   */
  isActive: boolean | null;
  /**
   * User is verified
   */
  isVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  language: string | null;
  role: Role | null;
  permissions: Permission[] | null;
  groupId: string | null;
}

export interface userSelfUpdate {
  /**
   * Update user's own info
   */
  userSelfUpdate: userSelfUpdate_userSelfUpdate;
}

export interface userSelfUpdateVariables {
  input: UserSelfUpdateInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AuthStatus
// ====================================================

export interface AuthStatus {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AuthTokenStatus
// ====================================================

export interface AuthTokenStatus {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: User
// ====================================================

export interface User {
  __typename: "UserDto";
  id: string;
  email: string | null;
  /**
   * User is active
   */
  isActive: boolean | null;
  /**
   * User is verified
   */
  isVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  language: string | null;
  role: Role | null;
  permissions: Permission[] | null;
  groupId: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * User permission
 */
export enum Permission {
  appALL = "appALL",
  groupALL = "groupALL",
  groupCREATE = "groupCREATE",
  groupDELETE = "groupDELETE",
  groupREAD = "groupREAD",
  groupUPDATE = "groupUPDATE",
  userALL = "userALL",
  userCREATE = "userCREATE",
  userDELETE = "userDELETE",
  userREAD = "userREAD",
  userUPDATE = "userUPDATE",
}

/**
 * User role
 */
export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  SUPERUSER = "SUPERUSER",
  USER = "USER",
}

export interface ChangePasswordRequestInput {
  email: string;
}

export interface UserCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserCredentialsInput {
  email: string;
  password: string;
}

export interface UserSelfUpdateInput {
  firstName?: string | null;
  id: string;
  lastName?: string | null;
}

export interface UserVerifyInput {
  idb64: string;
  token: string;
}

export interface UserWhereByIdInput {
  id: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
