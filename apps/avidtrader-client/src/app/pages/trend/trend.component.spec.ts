/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrendComponent } from './trend.component';

xdescribe('TrendComponent', () => {
  let component: TrendComponent;
  let fixture: ComponentFixture<TrendComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TrendComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
