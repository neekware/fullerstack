import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { MaterialModule } from '@fullerstack/ngx-material';

/** Application Environment with remote config endpoint */
const appEnv: Readonly<ApplicationConfig> = {
  version: '1.0.1',
  production: true,
  remoteConfig: {
    endpoint: 'http://foo.com/remote/config',
  },
};

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          MaterialModule,
          ConfigModule.forRoot(appEnv),
        ],
        declarations: [AppComponent],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
