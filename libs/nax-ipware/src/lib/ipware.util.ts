import {
  IPWARE_DEFAULT_IP_DIRECTION,
  IPWARE_LOOPBACK_PREFIX,
  IPWARE_META_PRECEDENCE_ORDER,
  IPWARE_NON_PUBLIC_IP_PREFIX,
} from './ipware.default';
import { IpwareData, IpwareIpInfo, IpwareTypes } from './ipware.model';

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
 * Returns true if ip is loopback, else returns false
 */
export function isLoopbackIP(ip: string, loopbackIpPrefixList = IPWARE_LOOPBACK_PREFIX): boolean {
  ip = ip.toLowerCase();
  for (const prefix of loopbackIpPrefixList) {
    return ip.startsWith(prefix);
  }
  return false;
}

/**
 * Returns true if ip is private & not routable, else returns false
 */
export function isPrivateIP(
  ip: string,
  nonPublicIpPrefixList = IPWARE_NON_PUBLIC_IP_PREFIX
): boolean {
  ip = ip.toLowerCase();
  for (const prefix of nonPublicIpPrefixList) {
    return ip.startsWith(prefix);
  }
  return false;
}

/**
 * Returns true if ip is public & routable, else returns false
 */
export function isPublicIP(ip: string): boolean {
  return !isPrivateIP(ip);
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
 * Returns HTTP request headers attribute by key
 * @param headers HTTP request headers
 * @param key HTTP request header key
 */
export function getHeadersAttribute(headers: IpwareTypes, attr: string): string {
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
export function getIpFromRequest(request): string {
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

/**
 * Given a string, it returns a list of one or more valid IP addresses
 */
export function getIPsFromString(ipString: string): IpwareData {
  const ipList: IpwareData = { ips: [], count: 0 };
  for (const ip of ipString.toLowerCase().split(',').map(cleanUpIP).filter(isValidIP)) {
    ipList.ips.push(ip);
  }
  ipList.count = ipList.ips.length || 0;

  return ipList;
}

/**
 * Given a string, it returns a tuple of (IP, Routable).
 */
export function getIpInfo(ipString: string): IpwareIpInfo {
  const cleanedIP = cleanUpIP(ipString);
  if (isValidIP(cleanedIP)) {
    return { ip: cleanedIP, routable: true };
  }
  return { ip: '', routable: false };
}

/**
 * Given two IP addresses, it returns the the best match ip
 * Note: Order of precedence is (Public, Private, Loopback, None)
 */
export function getBestIP(lastIP: string, nextIp: string): string {
  if (!lastIP) {
    return nextIp;
  }

  if (isPublicIP(lastIP) && !isPublicIP(nextIp)) {
    return lastIP;
  }

  if (isPrivateIP(lastIP) && isLoopbackIP(nextIp)) {
    return lastIP;
  }

  return nextIp;
}

export function getClientIP(
  request,
  requestHeadersOrder: string[],
  proxyTrustedIPs: string[],
  proxyOrder = 'left-most'
): IpwareIpInfo {
  proxyTrustedIPs = proxyTrustedIPs || [];
  requestHeadersOrder = requestHeadersOrder?.length
    ? requestHeadersOrder
    : IPWARE_META_PRECEDENCE_ORDER;

  const proxyCount = proxyTrustedIPs.length;

  for (const key of requestHeadersOrder) {
    const ipString = getHeadersAttribute(request.headers, key);
    if (ipString) {
      // process the ip string, we can have multiple ip addresses in the same string
      const ipData = getIPsFromString(ipString);

      // expecting at least one IP address, let's look for the next header
      if (ipData.count < 1) {
        continue;
      }

      // expecting requests via proxies to be `custom` & reverse in direction (`<proxy2>, <proxy1>, <client>`)
      // default is configuration for most servers is `left-most` (`<client>, <proxy1>, <proxy2>`)
      if (proxyOrder === IPWARE_DEFAULT_IP_DIRECTION.rightMost && ipData.count > 1) {
        ipData.ips = ipData.ips.reverse();
      }

      const ipInfo = getIpInfo(ipData.ips[0]);
      if (ipInfo.ip && ipInfo.routable) {
        const matchedIPs = [ipData.ips[0], ...proxyTrustedIPs];

        ipInfo.trustedRoute =
          proxyCount > 0 ? JSON.stringify(matchedIPs) === JSON.stringify(ipData.ips) : false;

        return ipInfo;
      }
    }
  }

  // no ip address from headers, let's try the request itself
  const reqIp = getIpFromRequest(request);

  const ipInfo = getIpInfo(reqIp);
  if (ipInfo.ip && ipInfo.routable) {
    if (proxyCount > 0) {
      ipInfo.trustedRoute = false;
    }
    return ipInfo;
  }
}
