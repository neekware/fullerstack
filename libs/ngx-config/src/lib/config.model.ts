/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Http Methods - GET / POST Supported
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface EnvironmentConfig {
  // true for production build
  production: boolean;
  // application release version
  version?: string;
  // application name
  appName?: string;
  // extra attributes
  [id: string]: any;
}

export interface LocalConfig {
  // if target supports multi-tab apps (browsers)
  multiTab?: boolean;
  // url to login page for user authentication (for anonymous users only)
  loginPageUrl?: string;
  // url to sign-up page for user to register (for anonymous users only)
  registerPageUrl?: string;
  // url to landing page for authenticated users only
  loggedInLandingPageUrl?: string;
  // url to the page where users are redirected to after log-out
  loggedOutRedirectUrl?: string;
  // extra attributes
  [id: string]: any;
}

export interface RemoteConfig {
  // url to fetch config file from
  endpoint: string;
  // http headers to be sent with request
  headers?: { [id: string]: any };
  // post body to be sent with request
  body?: { [id: string]: any };
  // http method (get, post) (if post, body will be ignored)
  method?: HttpMethod;
  // maximum time in seconds to wait for remote config response
  timeout?: number;
  // extra attributes
  [id: string]: any;
}

export interface ApplicationConfig extends EnvironmentConfig {
  // local config
  localConfig?: LocalConfig;
  // remote config (json object)
  remoteConfig?: RemoteConfig;
  // received data from remote
  remoteData?: { [id: string]: any };
  // extra modules (ext.auth, ext.log)
  [id: string]: any;
}

export type RemoteType = Promise<any>;
