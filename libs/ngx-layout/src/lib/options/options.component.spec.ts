import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';

import { OptionsComponent } from './options.component';
import { LayoutService } from '../layout.service';
import { NgxsModule } from '@ngxs/store';
import { LoggerModule } from '@fullerstack/ngx-logger';

export const environment: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NgxsModule.forRoot([]),
          NgxsModule.forFeature([]),
          ConfigModule.forRoot(environment),
          LoggerModule,
        ],
        declarations: [OptionsComponent],
        providers: [LayoutService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
