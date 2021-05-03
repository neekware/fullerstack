export interface FooterLinks {
  name: string;
  link: string;
  icon?: string;
  external?: boolean;
}

export interface FooterItem {
  type: string;
  links: FooterLinks[];
}
