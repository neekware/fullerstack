export interface IpwareIpInfo {
  ip: string;
  routable: boolean;
  trustedRoute?: boolean;
}

export interface IpwareData {
  ips: string[];
  count: number;
}
