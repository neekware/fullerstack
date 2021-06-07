import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdateComponent } from './profile-update.component';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
