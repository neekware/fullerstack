# @fullerstack/agx-store <img style="margin-bottom: -6px" width="30" src="../../libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

**A simple flat state-store that helps implement lite-redux pattern**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

This library helps implementing a flat `redux` state store, with simplicity and performance in mind.

**@fullerstack/agx-store** attempts to simplify the reactive implementation of your browser application, through minimal `redux` patterns, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/agx-store |OR| yarn add @fullerstack/agx-store

# How to use

```typescript
// auth.model.ts
import { DeepReadonly } from 'ts-essentials';

// define the shape of the auth state
export interface AuthState {
  userId: string;
  isAnonymous: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
  token: string;
}

// create an immutable default state
export const DefaultAuthState: DeepReadonly<AuthState> = {
  userId: null,
  isAnonymous: false,
  isLoading: false,
  isLoggedIn: false,
  isRegistering: false,
  isAuthenticating: false,
  hasError: false,
  token: null,
};
```

```typescript
import { DeepReadonly } from 'ts-essentials';
import { Subscription } from 'rxjs';
import { Store, StoreStateType } from '@fullerstack/agx-store';

// auth service
export class AuthService<T = StoreStateType> {
  // state slice name to be reserved for the auth service
  private nameSpace = 'AUTH';

  // claim ID of the slice is stored post registration
  // read-access to auth state is open to all
  // write-access to auth state is only open to those with a valid claimId
  private claimId: string;

  // holds our local state (if we need to compare `prev` vs. `next`)
  // a local deep clone copy of our state, which is also immutable
  // to allow others read-access, without the ability to mutate our local state
  state: DeepReadonly<AuthState> = DefaultAuthState;

  // auth state subscription, so we can unsubscribe on cleanup
  readonly stateSub$: Subscription;

  // we need to create an instance of the store here
  // alternatively, an app-level store could be used if available
  private store: StoreState;

  constructor() {
    // instantiate a new local store
    this.store = new StoreState<T>({} as T, { ...this.options.store });

    // reserve our AUTH slice from the full state
    // we choose console.log as our slice/state logger
    // alternatively a custom logger implementing the console api can be chosen
    this.claimId = this.store.claimSlice(sliceName, console.log);

    // subscribe to state changes for auth
    this.stateSub$ = this.store.select$<AuthState>(this.nameSpace).subscribe({
      next: (newState) => {
        const prevState = cloneDeep(this.state);
        this.state = { ...DefaultAuthState, ...newState };
        if (this.state.isLoggedIn && !prevState.isLoggedIn) {
          console.log(`You are logged in now!`);
        }
        // do other stuff, if you may!
      },
    });
  }

  loginRequest(input: UserCredentialsInput) {
    // set auth state to authenticating
    // loading started ...
    this.store.setState(
      this.claimId, // provide write-access claimId
      {
        ...this.state,
        isAuthenticating: true,
        isLoading: true,
      },
      'AUTH_LOGIN_REQ_SENT' // action name (optional)
    );

    // make login request (e.g. `doFetch()` is your way of communicating with your server)
    const resp = doFetch('/login', input);
    if (resp.ok) {
      // set auth state to authenticated
      // loading ended ...
      this.store.setState(
        this.claimId,
        {
          ...DefaultAuthState,
          isLoggedIn: true,
          token: resp.token,
          userId: resp.userId,
        },
        'AUTH_LOGIN_REQ_SUCCESS' // action
      );
    } else {
      // set auth state to authentication failed
      // loading ended ...
      this.store.setState(
        this.claimId,
        {
          ...DefaultAuthState,
          hasError: true,
          message: resp.message,
        },
        'AUTH_LOGIN_REQ_FAILED' // action
      );
    }
  }

  // clean up and free up resources prior to class instance `destroy`
  cleanUp() {
    this.stateSub$.unsubscribe();
    this.store.releaseSlice(this.nameSpace);
    this.store = undefined;
  }
}
```

```txt
// console.log ...
[STORE][PREV][AUTH_LOGIN_REQ_SENT] ↠ {AUTH: {…}}
[STORE][NEXT][AUTH_LOGIN_REQ_SENT] ↠ {AUTH: {…}}
[AUTH] Login request sent ...
[STORE][PREV][AUTH_LOGIN_REQ_SUCCESS] ↠ {AUTH: {…}}
[STORE][NEXT][AUTH_LOGIN_REQ_SUCCESS] ↠ {AUTH: {…}}
[AUTH] Login request success ...
```

# Advanced Use

## Action (Optional)

```typescript
// Call signature of:
// setState<K = any>(claimId: string, updater: K, action?: string): K {}

// State can be passed in, along with claimId, skipping the action type
// If a logger is passed in, the action will be missing from state change logs
this.store.setState(this.claimId, {
  isAuthenticating: true,
  isLoading: true,
});

// State can be passed in, along with claimId, as well as an action type
// If a logger is passed in, the action will in the state change logs
this.store.setState(this.claimId, {
  isAuthenticating: true,
  isLoading: true,
}, 'AUTH_LOGIN_REQ_SENT');
```

## Reducer (Optional)

```typescript
// Call signature of:
// setState<K = any>(claimId: string, updater: StoreStateReducer<T, K>, action?: string): K;

// Where StoreStateReducer is:
// export type StoreStateReducer<T = any, K = any> = (fullState: T) => K;

// State reducer function can be passed in, along with claimId and action type
// If a logger is passed in, the action will be missing from state change logs
this.store.setState(this.claimId, (fullStoreState) => {
  if (fullStoreState['app'].private) {
    return {
      ...fullStoreState[this.sliceName],
      isAuthenticating: true,
      isLoading: true,
    },
  }
  return {
    // no login is required
    ...DefaultAuthState,
    isAnonymous: true
  }
}, 'AUTH_LOGIN_REQ_SENT');

```

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack/agx-store.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/agx-store
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/agx-store.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/agx-store
