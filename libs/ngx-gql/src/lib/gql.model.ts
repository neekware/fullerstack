/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { DocumentNode } from 'graphql/language/ast';

export class GqlConfig {
  endpoint: string;
}

export interface GqlRequestBody {
  query: string;
  operationName: string;
  variables: { [id: string]: any };
}

export interface GqlResponseBody {
  data: any;
  error?: any;
  [id: string]: any;
}

export interface Variables {
  [key: string]: any;
}

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
}

export interface GraphQLResponseError {
  message: string;
  statusCode: number;
  operationName?: string;
}

export interface GqlResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;
  [key: string]: any;
}

export interface GqlRequestContext<V = Variables> {
  query: string;
  variables?: V;
}

export type RequestDocument = string | DocumentNode;

export interface GqlHttpOptions {
  observe?: 'body';
  responseType?: 'json';
  withCredentials?: boolean;
  context?: HttpContext;
  reportProgress?: boolean;
  params?:
    | HttpParams
    | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
}
