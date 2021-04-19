/**
 * Auth session expiry in days
 */
export const AUTH_SESSION_EXPIRY_DEFAULT = 7;

/**
 * Auth Jwt expiry in minutes
 */
export const AUTH_JWT_EXPIRY_DEFAULT = 5;

/**
 * Salt hash creation cost factor
 * The cost factor controls how much time is needed to calculate a single bCrypt hash
 */
export const AUTH_PASSWORD_SALT_ROUND_DEFAULT = 10;

/**
 * Minimum password length
 */
export const AUTH_PASSWORD_MIN_LENGTH = 6;

/**
 * Jwt session HttpOnly cookie name
 */
export const AUTH_SESSION_COOKIE_NAME = 'jwt';
