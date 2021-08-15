// Search for the real IP address in the following order (user configurable)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
// X-Forwarded-For: <client>, <proxy1>, <proxy2>

import { IpwareIpInfo } from './ipware.model';

// Configurable via settings.py
export const IPWARE_META_PRECEDENCE_ORDER: string[] = [
  'X_FORWARDED_FOR', // Load balancers or proxies such as AWS ELB (default client is `left-most` [`<client>, <proxy1>, <proxy2>`])
  'HTTP_X_FORWARDED_FOR',
  'HTTP_CLIENT_IP', // Standard headers used by providers such as Amazon EC2, Heroku etc.
  'HTTP_X_REAL_IP',
  'HTTP_X_FORWARDED',
  'HTTP_X_CLUSTER_CLIENT_IP',
  'HTTP_FORWARDED_FOR',
  'HTTP_FORWARDED',
  'HTTP_VIA',
  'X-REAL-IP', // NGINX
  'X-CLUSTER-CLIENT-IP', // Rackspace Cloud Load Balancers
  'X_FORWARDED',
  'FORWARDED_FOR',
  'CF-CONNECTING-IP', // CloudFlare
  'TRUE-CLIENT-IP', // CloudFlare Enterprise,
  'FASTLY-CLIENT-IP', // Firebase, Fastly
  'FORWARDED',
];

// Private IP addresses (user configurable)
// Note: Regex would be ideal here, but this is keeping it simple
// http://en.wikipedia.org/wiki/List_of_assigned_/8_IPv4_address_blocks
// https://en.wikipedia.org/wiki/Reserved_IP_addresses
// https://www.ietf.org/rfc/rfc1112.txt (IPv4 multicast)
// http://www.ietf.org/rfc/rfc3330.txt (IPv4)
// http://www.ietf.org/rfc/rfc5156.txt (IPv6)
// https://www.ietf.org/rfc/rfc6890.txt
export const IPWARE_PRIVATE_IP_PREFIX: string[] = [
  '0.', // messages to software
  '10.', // class A private block
  ...[
    // carrier-grade NAT (IPv4)
    '100.64.',
    '100.65.',
    '100.66.',
    '100.67.',
    '100.68.',
    '100.69.',
    '100.70.',
    '100.71.',
    '100.72.',
    '100.73.',
    '100.74.',
    '100.75.',
    '100.76.',
    '100.77.',
    '100.78.',
    '100.79.',
    '100.80.',
    '100.81.',
    '100.82.',
    '100.83.',
    '100.84.',
    '100.85.',
    '100.86.',
    '100.87.',
    '100.88.',
    '100.89.',
    '100.90.',
    '100.91.',
    '100.92.',
    '100.93.',
    '100.94.',
    '100.95.',
    '100.96.',
    '100.97.',
    '100.98.',
    '100.99.',
    '100.100.',
    '100.101.',
    '100.102.',
    '100.103.',
    '100.104.',
    '100.105.',
    '100.106.',
    '100.107.',
    '100.108.',
    '100.109.',
    '100.110.',
    '100.111.',
    '100.112.',
    '100.113.',
    '100.114.',
    '100.115.',
    '100.116.',
    '100.117.',
    '100.118.',
    '100.119.',
    '100.120.',
    '100.121.',
    '100.122.',
    '100.123.',
    '100.124.',
    '100.125.',
    '100.126.',
    '100.127.',
  ],
  '169.254.', // link-local block
  ...[
    '172.16.', // class B private blocks (IPv4)
    '172.17.',
    '172.18.',
    '172.19.',
    '172.20.',
    '172.21.',
    '172.22.',
    '172.23.',
    '172.24.',
    '172.25.',
    '172.26.',
    '172.27.',
    '172.28.',
    '172.29.',
    '172.30.',
    '172.31.',
  ],
  '192.0.0.', // reserved for IANA special purpose address registry
  '192.0.2.', // reserved for documentation and example code
  '192.168.', // class C private block
  ...[
    // reserved for inter-network communications between two separate subnets
    '198.18.',
    '198.19.',
  ],
  '198.51.100.', // reserved for documentation and example code
  '203.0.113.', // reserved for documentation and example code
  ...[
    // multicast
    '224.',
    '225.',
    '226.',
    '227.',
    '228.',
    '229.',
    '230.',
    '231.',
    '232.',
    '233.',
    '234.',
    '235.',
    '236.',
    '237.',
    '238.',
    '239.',
  ],
  ...[
    // reserved
    '240.',
    '241.',
    '242.',
    '243.',
    '244.',
    '245.',
    '246.',
    '247.',
    '248.',
    '249.',
    '250.',
    '251.',
    '252.',
    '253.',
    '254.',
    '255.',
  ],
  ...[
    // ipv6 related
    '::', // Unspecified address
    '::ffff:',
    '2001:10:',
    '2001:20:', // messages to software
    '2001::', // TEREDO
    '2001:2::', // benchmarking
    '2001:db8:', // reserved for documentation and example code
    'fc00:', // IPv6 private block
    'fe80:', // link-local unicast
    'ff00:', // IPv6 multicast
  ],
];

export const IPWARE_LOOPBACK_PREFIX: string[] = [
  '127.', // IPv4 loopback device (Host)
  '::1', // IPv6 loopback device (Host)
];

export const IPWARE_NON_PUBLIC_IP_PREFIX = [...IPWARE_PRIVATE_IP_PREFIX, ...IPWARE_LOOPBACK_PREFIX];

export enum IPWARE_DEFAULT_IP_DIRECTION {
  'leftMost' = 'left-most',
  'rightMost' = 'right-most',
}

export const IPWARE_DEFAULT_IP_INFO: IpwareIpInfo = {
  ip: '',
  routable: false,
};
