/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authUserLogin
// ====================================================

export interface authUserLogin_authUserLogin {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authUserLogin {
  authUserLogin: authUserLogin_authUserLogin;
}

export interface authUserLoginVariables {
  input: AuthUserCredentialsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authUserLogout
// ====================================================

export interface authUserLogout_authUserLogout {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authUserLogout {
  authUserLogout: authUserLogout_authUserLogout;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authUserSignup
// ====================================================

export interface authUserSignup_authUserSignup {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authUserSignup {
  authUserSignup: authUserSignup_authUserSignup;
}

export interface authUserSignupVariables {
  input: AuthUserSignupInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authTokenRefresh
// ====================================================

export interface authTokenRefresh_authTokenRefresh {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string | null;
}

export interface authTokenRefresh {
  authTokenRefresh: authTokenRefresh_authTokenRefresh;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authEmailVerifyAvailability
// ====================================================

export interface authEmailVerifyAvailability_authEmailVerifyAvailability {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authEmailVerifyAvailability {
  authEmailVerifyAvailability: authEmailVerifyAvailability_authEmailVerifyAvailability;
}

export interface authEmailVerifyAvailabilityVariables {
  input: AuthEmailVerifyAvailabilityInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authUserVerify
// ====================================================

export interface authUserVerify_authUserVerify {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authUserVerify {
  authUserVerify: authUserVerify_authUserVerify;
}

export interface authUserVerifyVariables {
  input: AuthUserVerifyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authPasswordVerify
// ====================================================

export interface authPasswordVerify_authPasswordVerify {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authPasswordVerify {
  authPasswordVerify: authPasswordVerify_authPasswordVerify;
}

export interface authPasswordVerifyVariables {
  input: AuthPasswordVerifyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authPasswordChange
// ====================================================

export interface authPasswordChange_authPasswordChange {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authPasswordChange {
  authPasswordChange: authPasswordChange_authPasswordChange;
}

export interface authPasswordChangeVariables {
  input: AuthPasswordChangeInput;
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
  input: AuthPasswordChangeRequestInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authPasswordVerifyResetRequest
// ====================================================

export interface authPasswordVerifyResetRequest_authPasswordVerifyResetRequest {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authPasswordVerifyResetRequest {
  authPasswordVerifyResetRequest: authPasswordVerifyResetRequest_authPasswordVerifyResetRequest;
}

export interface authPasswordVerifyResetRequestVariables {
  input: AuthPasswordVerifyResetRequestInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authPasswordPerformReset
// ====================================================

export interface authPasswordPerformReset_authPasswordPerformReset {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authPasswordPerformReset {
  authPasswordPerformReset: authPasswordPerformReset_authPasswordPerformReset;
}

export interface authPasswordPerformResetVariables {
  input: AuthPasswordPerformResetInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authEmailChangeRequest
// ====================================================

export interface authEmailChangeRequest_authEmailChangeRequest {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authEmailChangeRequest {
  authEmailChangeRequest: authEmailChangeRequest_authEmailChangeRequest;
}

export interface authEmailChangeRequestVariables {
  input: AuthEmailChangeRequestInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authEmailChangePerform
// ====================================================

export interface authEmailChangePerform_authEmailChangePerform {
  __typename: "AuthStatusDto";
  ok: boolean;
  message: string | null;
}

export interface authEmailChangePerform {
  authEmailChangePerform: authEmailChangePerform_authEmailChangePerform;
}

export interface authEmailChangePerformVariables {
  input: AuthEmailChangePerformInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: systemContactUs
// ====================================================

export interface systemContactUs_systemContactUs {
  __typename: "SystemStatusDto";
  ok: boolean;
  message: string | null;
}

export interface systemContactUs {
  systemContactUs: systemContactUs_systemContactUs;
}

export interface systemContactUsVariables {
  input: SystemContactUsInput;
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
// GraphQL fragment: SystemStatus
// ====================================================

export interface SystemStatus {
  __typename: "SystemStatusDto";
  ok: boolean;
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
  contactMessageALL = "contactMessageALL",
  contactMessageCREATE = "contactMessageCREATE",
  contactMessageDELETE = "contactMessageDELETE",
  contactMessageREAD = "contactMessageREAD",
  contactMessageUPDATE = "contactMessageUPDATE",
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

export interface AuthEmailChangePerformInput {
  token: string;
}

export interface AuthEmailChangeRequestInput {
  email: string;
}

export interface AuthEmailVerifyAvailabilityInput {
  email: string;
}

export interface AuthPasswordChangeInput {
  newPassword: string;
  oldPassword: string;
  resetOtherSessions?: boolean | null;
}

export interface AuthPasswordChangeRequestInput {
  email: string;
}

export interface AuthPasswordPerformResetInput {
  password: string;
  resetOtherSessions?: boolean | null;
  token: string;
}

export interface AuthPasswordVerifyInput {
  password: string;
}

export interface AuthPasswordVerifyResetRequestInput {
  token: string;
}

export interface AuthUserCredentialsInput {
  email: string;
  password: string;
}

export interface AuthUserSignupInput {
  email: string;
  firstName: string;
  language: string;
  lastName: string;
  password: string;
}

export interface AuthUserVerifyInput {
  token: string;
}

export interface SystemContactUsInput {
  content: string;
  email: string;
  name: string;
  subject: string;
}

export interface UserSelfUpdateInput {
  firstName?: string | null;
  id: string;
  language?: string | null;
  lastName?: string | null;
}

export interface UserWhereByIdInput {
  id: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
