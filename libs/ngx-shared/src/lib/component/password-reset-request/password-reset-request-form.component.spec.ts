/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '@fullerstack/ngx-util';

import { PasswordResetRequestFormComponent } from './password-reset-request-form.component';

xdescribe('PasswordResetRequestFormComponent', () => {
  let component: PasswordResetRequestFormComponent;
  let fixture: ComponentFixture<PasswordResetRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetRequestFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [ValidationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
