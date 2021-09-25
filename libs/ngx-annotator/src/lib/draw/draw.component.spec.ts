import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorComponent } from './draw.component';

describe('AnnotatorComponent', () => {
  let component: AnnotatorComponent;
  let fixture: ComponentFixture<AnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
