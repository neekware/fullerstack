/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { SubifyDecorator } from './subify.decorator';

const mockSub1 = {
  unsubscribe: () => {
    console.log('Sub1 cancelled');
  },
};

const mockSub2 = {
  unsubscribe: () => {
    console.warn('Sub2 cancelled');
  },
};

describe('@SubifyDecorator', () => {
  const error = console.error;
  const log = console.log;
  const warn = console.warn;

  beforeEach(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = error;
    console.warn = warn;
    console.log = log;
  });

  jest.spyOn(console, 'error');
  jest.spyOn(console, 'log');
  jest.spyOn(console, 'warn');

  it('should implement OnDestroy', () => {
    @SubifyDecorator()
    class SubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    expect(typeof comp['ngOnDestroy']).toBe('function');
  });

  it('should error on missing destroy$', () => {
    @SubifyDecorator({
      takeUntilInputName: 'destroy$',
    })
    class SubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.error).toHaveBeenCalled();
  });

  it('should not error if destroy$ exists', () => {
    @SubifyDecorator({
      takeUntilInputName: 'destroy$',
    })
    class SubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should error on invalid takeUntilInputName', () => {
    @SubifyDecorator({
      takeUntilInputName: 'foobar$',
    })
    class SubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.error).toHaveBeenCalled();
  });

  it('should call ngOnDestroy of super', () => {
    @SubifyDecorator()
    class SubComponent implements OnDestroy {
      ngOnDestroy() {
        console.log('ngOnDestroy of super called');
      }
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should process destroy$ on ngOnDestroy', () => {
    @SubifyDecorator({
      takeUntilInputName: 'destroy$',
    })
    class SubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    const processTakeUtilSpy = jest.spyOn(<any>comp, '_processTakeUtil');
    comp['ngOnDestroy']();
    expect(processTakeUtilSpy).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    @SubifyDecorator({
      takeUntilInputName: 'destroy$',
    })
    class SubComponent implements OnDestroy {
      destroy$: Subject<boolean> = new Subject<boolean>();
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    const completeSpy = jest.spyOn(<any>comp.destroy$, 'complete');
    comp['ngOnDestroy']();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should warn on missing included subscriptions', () => {
    @SubifyDecorator({
      includes: ['foobar$'],
    })
    class SubComponent implements OnDestroy {
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should process includes option', () => {
    @SubifyDecorator({
      includes: ['sub1$'],
    })
    class SubComponent implements OnDestroy {
      sub1$ = mockSub1;
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    const processIncludesSpy = jest.spyOn(<any>comp, '_processIncludes');
    comp['ngOnDestroy']();
    expect(processIncludesSpy).toHaveBeenCalled();
  });

  it('should cancel included subscriptions', () => {
    @SubifyDecorator({
      includes: ['sub1$'],
    })
    class SubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should process excluded option', () => {
    @SubifyDecorator({
      excludes: ['sub2$'],
    })
    class SubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    const processExcludesSpy = jest.spyOn(<any>comp, '_processExcludes');
    comp['ngOnDestroy']();
    expect(processExcludesSpy).toHaveBeenCalled();
  });

  it('should cancel non-excluded subscriptions', () => {
    @SubifyDecorator({
      excludes: ['sub2$'],
    })
    class SubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.log).toHaveBeenCalled();
  });

  it('should not cancel excluded subscriptions', () => {
    @SubifyDecorator({
      excludes: ['sub2$'],
    })
    class SubComponent implements OnDestroy {
      sub1$ = mockSub1;
      sub2$ = mockSub2;
      ngOnDestroy() {}
    }
    const comp = new SubComponent();
    comp['ngOnDestroy']();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
