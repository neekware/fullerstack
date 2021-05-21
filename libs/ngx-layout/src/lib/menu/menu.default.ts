import { _ } from '@fullerstack/ngx-i18n';
import { MenuItem } from '@fullerstack/ngx-menu';

export const LayoutMenuTree: MenuItem[] = [
  {
    name: _('MENU.ADMIN'),
    icon: 'wrench',
    children: [
      {
        name: _('MENU.PROFILE'),
        icon: 'account',
        link: '/auth/login',
      },
      {
        name: _('MENU.CONTACT'),
        icon: 'account-cog',
        link: '/auth/contact',
        fullspan: true,
      },
      {
        name: _('MENU.ABOUT'),
        icon: 'account',
        link: '/about/us',
        disabled: true,
      },
    ],
  },
  {
    name: _('MENU.STOCKS'),
    icon: 'trending-up',
    disabled: true,
    children: [
      {
        name: _('MENU.OWN'),
        icon: 'account-check',
        link: '/finance/stocks/own',
      },
      {
        name: _('MENU.WISHLIST'),
        icon: 'playlist-check',
        link: '/finance/stocks/wishlist',
      },
    ],
  },
  {
    name: _('MENU.BONDS'),
    icon: 'trending-up',
    children: [
      {
        name: _('MENU.OWN'),
        icon: 'account-check',
        link: '/finance/bonds/own',
      },
      {
        name: _('MENU.WISHLIST'),
        icon: 'playlist-check',
        link: '/finance/bonds/wishlist',
      },
    ],
  },
  {
    name: _('MENU.ETFS'),
    icon: 'trending-up',
    children: [
      {
        name: _('MENU.OWN'),
        icon: 'account-check',
        link: '/finance/etf/own',
      },
      {
        name: _('MENU.WISHLIST'),
        icon: 'playlist-check',
        link: '/finance/etf/wishlist',
      },
    ],
  },
  {
    name: _('MENU.YAHOO_FINANCE'),
    icon: 'google-analytics',
    link: 'https://yahoo.com',
    external: true,
    disabled: true,
  },
  {
    name: _('MENU.YOUTUBE'),
    icon: 'youtube',
    link: 'https://youtube.com',
    external: true,
    target: '_blank',
  },
];
