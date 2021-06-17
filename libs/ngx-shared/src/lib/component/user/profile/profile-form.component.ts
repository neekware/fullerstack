import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { I18nService, _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-user-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileFormComponent implements OnChanges {
  form: FormGroup;
  @Output() submit$ = new EventEmitter<UserSelfUpdateInput>();
  @Output() form$ = new EventEmitter<FormGroup>();
  @Input() profile: User;
  @Input() autocomplete = 'off';
  @Input() title = _('COMMON.PROFILE');
  @Input() subtitle = _('COMMON.PROFILE_UPDATE');
  @Input() icon = 'account-plus-outline';
  @Input() firstNameHint: string;
  @Input() lastNameHint: string;
  @Input() emailHint: string;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService
  ) {}

  ngOnChanges() {
    if (this.profile) {
      this.buildForm(this.profile);
    }
  }

  private buildForm(profile: User) {
    this.form = this.formBuilder.group({
      id: [profile.id],
      firstName: [profile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [profile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: profile.email, disabled: true }],
    });
    this.form$.emit(this.form);
  }

  submit() {
    this.submit$.emit(this.form.value);
  }
}
