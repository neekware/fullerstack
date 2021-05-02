/* eslint:disable */
//  This file was automatically generated and should not be edited.

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
