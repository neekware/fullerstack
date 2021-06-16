import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { _ } from '@fullerstack/ngx-i18n';
import { UserService } from '@fullerstack/ngx-user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-user-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent implements OnDestroy {
  destroy$ = new Subject<boolean>();
  title = _('COMMON.PROFILE');
  subtitle = _('COMMON.PROFILE_UPDATE');
  icon = 'account-edit-outline';

  constructor(
    readonly config: ConfigService,
    readonly auth: AuthService,
    readonly user: UserService
  ) {}

  update(data: UserSelfUpdateInput) {
    this.user.userSelfUpdateMutate(data).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
