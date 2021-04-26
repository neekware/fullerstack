# @fullerstack/ngx-subify <img style="margin-bottom: -6px" width="30" src="../../apps/fullerstack/src/assets/images/fullerstack-x250.png">

**A simple subscription manager library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Angular applications may rely heavily on RxJS in order to implement reactive components and services. Maintaining and tracking of all active subscriptions may be overwhelming at times. As such, Subify attempts to streamline subscription and make the cleanup easier.

**@fullerstack/ngx-subify** attempts to streamline the subscription manager of your application, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-subify |OR| yarn add @fullerstack/ngx-subify

# How to use

There are three ways to track and cancel your subscriptions.

1 - **Subscription Cleanup Manager**

2 - **Subscription Cleanup Service**

3 - **Subscription Cleanup Decorator**

## SubifyManager

1 - **Auto Canceling Subscription via SubifyManager Class**

```typescript

// in your component - Using SubManager
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { SubManager } from '@fullerstack/subify';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnDestroy {
  // instantiate  a new subscribe manager
  subMgr: SubManager = new SubManager();

  constructor() {
    // track a single subscription
    this.subMgr.track = interval(1000).subscribe(num => console.log(`customSub1$ - ${num}`));

    // track a list of subscriptions
    this.subMgr.track = [
      interval(1000).subscribe(num => console.log(`customSub2$ - ${num}`)),
      interval(1000).subscribe(num => console.log(`customSub3$ - ${num}`));
    ]
  }

  ngOnDestroy() {
    // unsubscribe all subscriptions
    this.subMgr.unsubscribe();
  }
}
```

2- **Auto Canceling Subscription via SubService**

**SubService** is a great way to let another `ephemeral` service to handle the canceling of subscriptions. It works with classes of type `Component`, `Directive` & `Pipe`.

```typescript

// in your component - Using SubService
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubService } from '@fullerstack/subify';

@Component({
  selector: 'home',
  // an ephemeral service instance per component instance
  providers: [SubService],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  customSub$: Subscription;

  constructor(private subService: SubService) {
    // track a single subscription
    this.subService.track = interval(1000).subscribe(num => console.log(`customSub1$ - ${num}`));

    // track a list of subscriptions
    this.subService.track = [
      interval(1000).subscribe(num => console.log(`customSub2$ - ${num}`)),
      interval(1000).subscribe(num => console.log(`customSub3$ - ${num}`));
    ]

    // automatically gets cleaned up by SubService's OnDestroy
    interval(3000)
      .pipe(takeUntil(this.subService.destroy$))
      .subscribe(num => console.log(`takeUntil - ${num}`));
  }
}
```

3 - **Auto Canceling Subscription Decorator**

**@SubifyDecorator()** is a great way to enhance a class to better handle the canceling of subscriptions. It works with classes of type `Component`, `Directive`, `Pipe` & `Injectable`. The decorated class must also implement `OnDestroy` even if unused.

```typescript
// in your component - Using Subscribable
import { Component, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SubifyDecorator } from '@fullerstack/subify';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
@SubifyDecorator()
export class HomeComponent implements OnDestroy {
  customSub$: Subscription;

  constructor() {
    // must keep a reference to our subscription for automatic cleanup
    this.customSub$ = interval(1000).subscribe((num) =>
      console.log(`customSub$ - ${num}`)
    );
  }

  // required even if unused. This is to prevent AOT tree shake ngOnDestroy of the decorated class
  ngOnDestroy() {}
}
```

# Advanced Usage

**Auto Canceling Subscription Decorator (w/ takeUntil)**

```typescript
// in your component - Using SubifyDecorator
import { Component, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubifyDecorator } from '@fullerstack/subify';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
@SubifyDecorator({
  // property used by takeUntil() - use destroy$ or any custom name
  takeUntilInputName: 'destroy$',
})
export class HomeComponent implements OnDestroy {
  // This is used in takeUntil() - @SubifyDecorator will manage it internally
  destroy$ = new Subject<boolean>();

  constructor() {
    // decorated class will trigger an auto clean up
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe((num) => console.log(`takeUntil - ${num}`));
  }

  // required even if unused. This is to prevent AOT tree shake ngOnDestroy of the decorated class
  ngOnDestroy() {}
}
```

**Auto Canceling Subscription Decorator (w/ Includes)**

```typescript
// in your component - Using SubifyDecorator
import { Component, Input, OnDestroy } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubifyDecorator } from '@fullerstack/subify';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
@SubifyDecorator({
  // specific subscription names to be auto canceled, everything else is ignored
  includes: ['customSub$'],
})
export class HomeComponent implements OnDestroy {
  // this is not our subscription, so we don't include it for auto clean up
  @Input() notOurSub$: Subscription;

  // this is our subscription and we include it for auto clean up
  customSub$: Subscription;

  constructor() {
    // decorated class auto clean this up
    this.customSub$ = interval(1000).subscribe((num) =>
      console.log(`customSub$ - ${num}`)
    );
  }

  // required even if unused. This is to prevent AOT tree shake ngOnDestroy of the decorated class
  ngOnDestroy() {}
}
```

**Auto Cancelling Subscription Decorator (w/ Excludes)**

```typescript
// in your component - Using SubifyDecorator
import { Component, Input, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SubifyDecorator } from '@fullerstack/subify';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
@SubifyDecorator({
  // subscription names not to be auto canceled, every other subscription will be clean up
  excludes: ['notOurSub$'],
})
export class HomeComponent implements OnDestroy {
  // this is not our subscription, so we exclude it from auto clean up
  @Input() notOurSub$: Subscription;

  // this is our subscription and it will be automatically cleaned up
  customSub$: Subscription;

  constructor() {
    this.customSub$ = interval(1000).subscribe((num) =>
      console.log(`customSub$ - ${num}`)
    );
  }

  // required even if unused. This is to prevent AOT tree shake ngOnDestroy of the decorated class
  ngOnDestroy() {}
}
```

# Note:

It is highly recommended that all subscriptions be unsubscribed unless they are explicitly piped through the `async` template pipe.
The cost of double unsubscribing is negligible while the cost of out of scope subscription is very high as it may contribute
to memory-leak and out-of-context execution and possible state corruptions.

It is recommended to turn `unsubscribe()` into muscle memory, by simply using it all the times.
But you may ask: what about `http.get()`?, won't it automatically completes?
Well, it does not complete in-time, if the invoking component is destroyed before the http response arrives.
If so, the http response will invoke the callback function of a `destroyed` component.
A `dead` component won't know the `current` state of the application, however
it might still point to it directly or via some `actions`. If so, it may corrupt the state.

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://secure.travis-ci.org/neekware/fullerstack.png?branch=main
[status-link]: http://travis-ci.org/neekware/fullerstack?branch=main
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-subify.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-subify
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-subify.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-subify
