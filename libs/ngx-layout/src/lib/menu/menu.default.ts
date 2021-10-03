/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { MenuItem } from '@fullerstack/ngx-menu';

export const layoutMenuTree: MenuItem[] = [
  {
    name: _('COMMON.ADMIN'),
    icon: 'wrench',
    permissions: [
      'sitewide.admin_sitewide',
      'sitewide.staff_sitewide',
      'sitewide.finance_sitewide',
    ],
    children: [
      {
        name: _('COMMON.PROFILE'),
        icon: 'account',
        link: '/auth/login',
      },
      {
        name: _('COMMON.CONTACT'),
        icon: 'account-card-details',
        link: '/auth/contact',
        fullspan: true,
      },
      {
        name: _('COMMON.ABOUT'),
        icon: 'account',
        link: '/about/us',
        disabled: true,
      },
    ],
  },
  {
    name: _('COMMON.ABOUT'),
    icon: 'information-outline',
    link: '/about/us',
  },
  {
    name: _('COMMON.FOREX'),
    icon: 'cash-multiple',
    link: '/forex',
  },
  {
    name: _('COMMON.STOCKS'),
    icon: 'trending-up',
    children: [
      {
        name: _('COMMON.PORTFOLIO'),
        icon: 'account-check',
        link: '/finance/stocks/own',
        fullspan: true,
      },
      {
        name: _('COMMON.TREND'),
        icon: 'playlist-check',
        link: '/finance/stocks/trend',
      },
    ],
  },
  {
    name: _('COMMON.BONDS'),
    icon: 'trending-up',
    disabled: true,
    children: [
      {
        name: _('COMMON.PORTFOLIO'),
        icon: 'account-check',
        link: '/finance/bonds/own',
      },
      {
        name: _('COMMON.WISHLIST'),
        icon: 'playlist-check',
        link: '/finance/bonds/whishlist',
      },
    ],
  },
  {
    name: _('COMMON.ETFS'),
    icon: 'trending-up',
    disabled: true,
    children: [
      {
        name: _('COMMON.PORTFOLIO'),
        icon: 'account-check',
        link: '/finance/etfs/own',
        fullspan: true,
      },
      {
        name: _('COMMON.WISHLIST'),
        icon: 'playlist-check',
        link: '/finance/etfs/whishlist',
      },
    ],
  },
  {
    name: _('COMMON.YAHOO_FINANCE'),
    icon: 'google-analytics',
    link: 'https://yahoo.com',
    external: true,
    disabled: true,
  },
  {
    name: _('COMMON.ANNOTATE'),
    icon: 'draw',
    link: '/annotate/draw',
    fullscreen: true,
    headless: true,
  },
  {
    name: _('COMMON.YOUTUBE'),
    icon: 'youtube',
    link: 'https://youtube.com',
    external: true,
    target: '_blank',
  },
  {
    name: _('COMMON.CONTACT_US'),
    icon: 'at',
    link: '/contact/us',
  },
];
