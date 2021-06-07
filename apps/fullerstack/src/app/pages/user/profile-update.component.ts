import { Component, OnInit } from '@angular/core';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import * as gqlSchema from '@fullerstack/ngx-gql/schema';
import { _ } from '@fullerstack/ngx-i18n';
import { UserService } from '@fullerstack/ngx-user';

@Component({
  selector: 'fullerstack-user-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent implements OnInit {
  title = _('COMMON.PROFILE');
  subtitle = _('COMMON.PROFILE_UPDATE');
  icon = 'account-plus-outline';

  constructor(
    readonly config: ConfigService,
    readonly auth: AuthService,
    readonly user: UserService
  ) {}

  ngOnInit() {
    // if (this.auth.state.isLoggedIn) {
    //   const redirectUrl = tryGet(
    //     () => this.config.options.localConfig.registerInLandingPageUrl,
    //     '/'
    //   );
    //   this.auth.goTo(redirectUrl);
    // } else {
    //   this.auth.initiateRegisterState();
    // }
  }

  update(data: gqlSchema.UserSelfUpdateInput) {
    this.user.userSelfUpdate(data);
  }
}
