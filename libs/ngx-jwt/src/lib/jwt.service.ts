/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Base64 } from 'js-base64';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultJwtConfig } from './jwt.default';

/**
 * An injectable class that handles JWT service
 */
@Injectable({ providedIn: 'root' })
export class JwtService {
  private nameSpace = 'JWT';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  /**
   * Class constructor
   * @param options an optional configuration object
   */
  constructor(readonly config: ConfigService, readonly logger: LoggerService) {
    this.options = ldMergeWith(
      ldDeepClone({ jwt: DefaultJwtConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.logger.info(`[${this.nameSpace}] JwtService ready ...`);
  }

  /**
   * Gets the payload portion of a JWT token
   * @param token JWT token (base64 encrypted)
   * @returns a payload object or null if decode fails
   */
  getPayload<T>(token: string): any {
    let parts = [];

    try {
      parts = token.split('.');
      if (parts.length !== 3) {
        throw Error('JWT must have 3 parts');
      }
    } catch (e) {
      this.logger.error(e.message);
      return undefined;
    }

    try {
      const decoded = Base64.decode(parts[1]);
      const payload = JSON.parse(decoded);
      return payload as T;
    } catch (e) {
      this.logger.error('Cannot decode the token');
    }

    return undefined;
  }

  /**
   * Tells if a JWT is token is expired
   * @param payload JWT payload object
   * @return true if JWT is already expired, else false
   */
  isExpired(payload: any): boolean {
    if (typeof payload === 'string') {
      payload = this.getPayload(payload);
    }
    if (payload) {
      const offset = (parseInt(payload.lee, 10) || this.options.jwt.expiryLeeway) * 1000;
      const now = this.utcSeconds();
      const expiry = this.utcSeconds(payload.exp);
      const expired = now > expiry + offset;
      return expired;
    }
    return true;
  }

  /**
   * Calculates the next refresh time
   * @param payload JWT payload object
   * @param offset if true, a random time is added to the refresh time
   * where networkDelay < random < leeway
   * @returns total number of seconds till expiry or 0 if token is expired
   */
  getRefreshTime(payload: any, offset = true): number {
    if (typeof payload === 'string') {
      payload = this.getPayload(payload);
    }
    if (payload && !this.isExpired(payload)) {
      const now = this.utcSeconds();
      const expiry = this.utcSeconds(payload.exp);
      const refresh = Math.floor((expiry - now) / 1000);
      const random = this.getRandomOffset(payload);
      const time = offset ? refresh + random : refresh;
      return time;
    }
    return 0;
  }

  /**
   * Calculates a random number where networkDelay < random < leeway
   * @param payload JWT payload object
   * @returns a random total number of seconds
   */
  private getRandomOffset(payload: any): number {
    if (typeof payload === 'string') {
      payload = this.getPayload(payload);
    }
    const leeway = payload?.leeway || payload?.lee || this.options?.jwt?.expiryLeeway;
    const range = {
      lower: 1,
      upper: leeway - this.options?.jwt?.networkDelay || 2,
    };
    return Math.floor(Math.random() * range.upper + range.lower);
  }

  /**
   * Calculates the UTC value of date/time in seconds
   * @param input date/time in seconds
   * @returns UTC value of date/time in seconds
   */
  private utcSeconds(input?: number): number {
    return input ? new Date(0).setUTCSeconds(input).valueOf() : new Date().valueOf();
  }
}
