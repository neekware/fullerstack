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

  beforeEach(() => {
    subMgr = new SubifyManager();
  });

  afterEach(() => {
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
    const logSpy = spyOn(console, 'log');
    subMgr.unsubscribe();
    expect(logSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() should handle invalid subscriptions', () => {
    const sub1$ = {} as Subscription;
    subMgr.track = [sub1$];
    const logSpy = spyOn(console, 'log');
    subMgr.unsubscribe();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
