import { IpwareData, IpwareHeaders } from './ipware.model';

/**
 * Check the validity of an IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4_pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return ipv4_pattern.test(ip);
}

/**
 * Check the validity of an IPv6 address
 */
export function isValidIPv6(ip: string): boolean {
  const ipv6_pattern = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;

  return ipv6_pattern.test(ip);
}

/**
 * Check the validity of an IP address
 */
export function isValidIP(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}

/**
 * Given ip address string, it cleans it up
 */
export function cleanUpIP(ip: string): string {
  ip = ip.trim();
  if (ip.toLowerCase().startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }
  return ip;
}

/**
 * Given a string, it returns a list of one or more valid IP addresses
 */
export function getIPsFromString(str: string): IpwareData {
  const ipList: IpwareData = { ips: [], count: 0 };
  for (const ip of str.toLowerCase().split(',').map(cleanUpIP).filter(isValidIP)) {
    ipList.ips.push(ip);
  }
  ipList.count = ipList.ips.length || 0;

  return ipList;
}

/**
 * Returns HTTP request headers attribute by key
 * @param headers HTTP request headers
 * @param key HTTP request header key
 */
export function getHeadersAttribute(headers: IpwareHeaders, attr: string): string {
  for (const key of Object.keys(headers)) {
    if (key === attr) {
      headers[key];
    }

    const upperCaseAttr = attr.toUpperCase();
    if (key === upperCaseAttr) {
      headers[key];
    }

    const lowerCaseAttr = attr.toUpperCase();
    if (key === lowerCaseAttr) {
      headers[key];
    }

    const dashedAttr = attr.replace(/_/g, '-');
    if (key === dashedAttr) {
      headers[key];
    }

    const underscoredAttr = attr.replace(/-/g, '_');
    if (key === underscoredAttr) {
      headers[key];
    }

    const dashedAttrUpperCase = dashedAttr.toUpperCase();
    if (key === dashedAttrUpperCase) {
      headers[key];
    }

    const underscoredAttrLowerCase = underscoredAttr.toLowerCase();
    if (key === underscoredAttrLowerCase) {
      headers[key];
    }
  }

  return '';
}

/**
 * Returns ip address information from the request itself
 */
export function getIpFromRequest(request: any): string {
  let ip = '127.0.0.1';
  try {
    ip = request.connection.remoteAddress;
  } catch (e) {
    try {
      ip = request.socket.remoteAddress;
    } catch (e) {
      try {
        ip = request.connection.socket.remoteAddress;
      } catch (e) {
        try {
          ip = request.info.remoteAddress;
        } catch (e) {
          try {
            ip = request.requestContext.identity.sourceIp; // AWS Lambda
          } catch (e) {
            ip = '127.0.0.1';
          }
        }
      }
    }
  }
  return ip || '127.0.0.1';
}
