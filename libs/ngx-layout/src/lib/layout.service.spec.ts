import { TestBed, inject } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { NgxsModule } from '@ngxs/store';

import { LayoutService } from './layout.service';

export const applicationConfig: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

xdescribe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        NgxsModule.forFeature([]),
        ConfigModule.forRoot(applicationConfig),
        LoggerModule,
      ],
      providers: [LayoutService],
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
