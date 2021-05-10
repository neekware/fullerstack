import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { NgxsModule } from '@ngxs/store';

import { LayoutService } from '../layout.service';
import { AccountComponent } from './account.component';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NgxsModule.forRoot([]),
          NgxsModule.forFeature([]),
          ConfigModule.forRoot(environment),
          LoggerModule,
        ],
        declarations: [AccountComponent],
        providers: [LayoutService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
