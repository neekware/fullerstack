/**
 * JWT config declaration
 */
export class JwtConfig {
  // http request round-trip in seconds
  networkDelay?: number;
  // refresh expired token up to leeway amount in seconds
  expiryLeeway?: number;
}
