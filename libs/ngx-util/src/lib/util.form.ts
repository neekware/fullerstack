import { FormControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';

export function getControl(name: string): FormControl {
  return tryGet<FormControl>(() => this.form.controls[name] as FormControl);
}
