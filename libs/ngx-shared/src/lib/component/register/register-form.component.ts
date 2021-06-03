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
import { ValidationAsyncService, ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit {
  form: FormGroup;
  @Output() submit$ = new EventEmitter<gqlSchema.UserCreateInput>();
  @Input() autocomplete = 'off';
  @Input() title = _('COMMON.REGISTER');
  @Input() subtitle = _('COMMON.ACCOUNT_CREATE');
  @Input() icon = 'account-plus-outline';
  @Input() nameHint: string;
  @Input() emailHint: string;
  @Input() passwordHint: string;
  @Input() passwordConfirmHint: string;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly asyncValidation: ValidationAsyncService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.validation.NAME_MIN_LEN),
            this.validation.validateFullName,
          ],
        ],
        email: [
          '',
          [Validators.required, this.validation.validateEmail],
          [this.asyncValidation.validateEmailAvailability()],
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(this.validation.PASSWORD_MIN_LEN)],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validator: this.validation.matchingPasswords }
    );
  }

  submit() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, ...rest } = this.form.value;
    const { firstName, lastName } = tokenizeFullName(this.form.value.name);
    const language = this.i18n.currentLanguage;
    this.submit$.emit({
      firstName,
      lastName,
      email,
      password,
    });
  }
}
