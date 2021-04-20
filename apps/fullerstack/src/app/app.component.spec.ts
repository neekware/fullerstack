import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';

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
        declarations: [AppComponent],
        imports: [HttpClientModule, ConfigModule.forRoot(appEnv)],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
