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
  message: string;
}

export interface authLogin {
  authLogin: authLogin_authLogin;
}

export interface authLoginVariables {
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authSignup
// ====================================================

export interface authSignup_authSignup {
  __typename: "AuthTokenDto";
  ok: boolean;
  token: string;
  message: string;
}

export interface authSignup {
  authSignup: authSignup_authSignup;
}

export interface authSignupVariables {
  email: string;
  password: string;
  firstName: string;
  lastName?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
