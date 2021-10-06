/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPositionComponent } from './position.component';

describe('MenuPositionComponent', () => {
  let component: MenuPositionComponent;
  let fixture: ComponentFixture<MenuPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuPositionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
