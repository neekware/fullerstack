import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tokenizeFullName } from '@fullerstack/agx-util';
import * as gqlSchema from '@fullerstack/ngx-gql/schema';
import { I18nService, _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-user-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileFormComponent implements OnInit {
  form: FormGroup;
  @Output() submit$ = new EventEmitter<gqlSchema.UserSelfUpdateInput>();
  @Input() profile: gqlSchema.User;
  @Input() autocomplete = 'off';
  @Input() title = _('COMMON.PROFILE');
  @Input() subtitle = _('COMMON.PROFILE_UPDATE');
  @Input() icon = 'account-plus-outline';
  @Input() nameHint: string;
  @Input() emailHint: string;
  @Input() passwordHint: string;
  @Input() passwordConfirmHint: string;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService
  ) {}

  ngOnInit() {
    this.buildForm(this.profile);
  }

  private buildForm(profile?: gqlSchema.User) {
    this.form = this.formBuilder.group({
      name: [
        `${profile?.firstName} ${profile?.lastName}`.trim() || '',
        [
          Validators.required,
          Validators.minLength(this.validation.NAME_MIN_LEN),
          this.validation.validateFullName,
        ],
      ],
      email: [{ value: profile?.email || '', disabled: true }],
    });
  }

  submit() {
    const { firstName, lastName } = tokenizeFullName(this.form.value.name);
    this.submit$.emit({ firstName, lastName });
  }
}
