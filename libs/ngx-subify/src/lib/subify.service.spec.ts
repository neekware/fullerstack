import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { SubifyService } from './subify.service';

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

describe('SubifyService', () => {
  let service: SubifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SubifyService],
    });

    service = TestBed.inject(SubifyService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have required props and methods', () => {
    expect(service.destroy$).toBeDefined();
    expect(service.ngOnDestroy).toBeDefined();
  });

  it('track should accept subscriptions objects', () => {
    const sub1$ = mockSub1 as Subscription;
    service.track = sub1$;
    expect(service['trackedSubs'].length).toBe(1);
  });

  it('track should accept a list of subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    const sub2$ = mockSub2 as Subscription;
    service.track = [sub1$, sub2$];
    expect(service['trackedSubs'].length).toBe(2);
  });

  it('ngOnDestroy() should complete destroy$', () => {
    const completeSpy = spyOn(service.destroy$, 'complete');
    service.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() should have cancelled subscriptions', () => {
    const sub1$ = mockSub1 as Subscription;
    service.track = sub1$;
    const sub2$ = mockSub1 as Subscription;
    service.track = sub2$;
    const logSpy = spyOn(console, 'log');
    service.ngOnDestroy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() should handle invalid subscriptions', () => {
    const sub1$ = {} as Subscription;
    service.track = [sub1$];
    const logSpy = spyOn(console, 'log');
    service.ngOnDestroy();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
