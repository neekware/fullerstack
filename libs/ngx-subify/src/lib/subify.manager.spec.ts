/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Subscription } from 'rxjs';

import { SubifyManager } from './subify.manager';

const mockSub1 = {
  unsubscribe: () => {
    console.log('Sub1 cancelled');
  },
};

const mockSub2 = {
  unsubscribe: () => {
    console.log('Sub2 cancelled');
  },
};

describe('SubService', () => {
  let subMgr: SubifyManager;
  const log = console.log;
  beforeEach(() => {
    console.log = jest.fn();
    subMgr = new SubifyManager();
  });

  afterEach(() => {
    console.log = log;
    subMgr = null;
  });

  it('should be created', () => {
    expect(subMgr).toBeTruthy();
  });

  it('track should accept subscriptions objects', () => {
    const sub1$ = mockSub1 as Subscription;
    subMgr.track = sub1$;
    expect(subMgr['trackedSubs'].length).toBe(1);
  });

  it('track should accept a list of subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    const sub2$ = mockSub2 as Subscription;
    subMgr.track = [sub1$, sub2$];
    expect(subMgr['trackedSubs'].length).toBe(2);
  });

  it('ngOnDestroy() should have cancelled subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    subMgr.track = sub1$;
    const sub2$ = mockSub1 as Subscription;
    subMgr.track = sub2$;
    const logSpy = jest.spyOn(console, 'log');
    subMgr.unsubscribe();
    expect(logSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() should handle invalid subscriptions', () => {
    const sub1$ = {} as Subscription;
    subMgr.track = [sub1$];
    const logSpy = jest.spyOn(console, 'log');
    subMgr.unsubscribe();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
