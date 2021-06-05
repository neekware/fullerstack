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

//==============================================================
// START Enums and Input Objects
//==============================================================

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

//==============================================================
// END Enums and Input Objects
//==============================================================
