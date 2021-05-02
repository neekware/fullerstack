import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UixModule } from '@fullerstack/ngx-uix';

import { NavbarComponent } from './navbar.component';
import { LayoutService } from '../layout.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UixModule],
        declarations: [NavbarComponent],
        providers: [LayoutService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
