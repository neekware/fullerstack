import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApplicationCfg, CfgModule } from '@fullerstack/ngx-cfg';

/** Application Environment with remote config endpoint */
const appEnv: Readonly<ApplicationCfg> = {
  version: '1.0.1',
  production: true,
  remoteCfg: {
    endpoint: 'http://foo.com/remote/cfg',
  },
};

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [HttpClientModule, CfgModule.forRoot(appEnv)],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
