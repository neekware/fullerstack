/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideMenuComponent } from './hide.component';

describe('HideMenuComponent', () => {
  let component: HideMenuComponent;
  let fixture: ComponentFixture<HideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HideMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
