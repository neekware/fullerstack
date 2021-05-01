import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { LayoutService } from '../layout.service';
import { NgxsModule } from '@ngxs/store';
import { ConfigModule, ApplicationConfig } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

export const environment: ApplicationConfig = {
  appName: '@fullerstack/layout',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NgxsModule.forRoot([]),
          NgxsModule.forFeature([]),
          ConfigModule.forRoot(environment),
          LoggerModule,
        ],
        declarations: [NotificationComponent],
        providers: [LayoutService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
