/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNodeComponent } from './menu-node.component';

xdescribe('MenuNodeComponent', () => {
  let component: MenuNodeComponent;
  let fixture: ComponentFixture<MenuNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuNodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
