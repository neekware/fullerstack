/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export class GTagConfig {
  // ability to disable tracking (ex; dev / staging mode)
  isEnabled: boolean;
  // google tracking id (UA-XXXXX-Y)
  trackingId: string;
  // track page view on start
  routeChangeTracking?: boolean;
  // tracking gtag.js URL
  gtagUrl?: string;
  // more optional parameters
  [key: string]: any;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export class GTagPageViewParams {
  // title of the page
  page_title?: string;
  // uri portion of the page location starting with /
  page_path?: string;
  // page_location	string	No	The page's URL.
  page_location?: string;
  // more optional future parameters
  [key: string]: any;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export interface GTagEventParams {
  event_category?: string;
  event_label?: string;
  value?: any;
  [key: string]: any;
}
