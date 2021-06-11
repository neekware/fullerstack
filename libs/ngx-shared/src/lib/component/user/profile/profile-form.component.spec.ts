import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFormComponent } from './profile-form.component';

xdescribe('UserProfileFormComponent', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
