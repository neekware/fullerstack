/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { UserVerifyComponent } from './user-verify.component';

xdescribe('UserVerifyComponent', () => {
  let component: UserVerifyComponent;
  let fixture: ComponentFixture<UserVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserVerifyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
