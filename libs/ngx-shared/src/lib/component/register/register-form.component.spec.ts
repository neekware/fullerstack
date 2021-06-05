import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CONFIG_TOKEN } from '@fullerstack/ngx-config';
import { ValidationService } from '@fullerstack/ngx-util';
import { TranslateService } from '@ngx-translate/core';

import { RegisterFormComponent } from './register-form.component';

xdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [RegisterFormComponent],
      providers: [
        ValidationService,
        {
          provide: CONFIG_TOKEN,
          useValue: {},
        },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
