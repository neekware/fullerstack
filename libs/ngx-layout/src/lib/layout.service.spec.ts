import { TestBed, inject } from '@angular/core/testing';

import { NgxsModule } from '@ngxs/store';
import { ConfigModule, ApplicationConfig } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

import { LayoutService } from './layout.service';

export const applicationConfig: ApplicationConfig = {
  appName: 'Fullerstack',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

describe('LayoutService', () => {
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
