import { Attribute, Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[autoCompleteOff]'
})
export class AutocompleteDirective {
  @HostBinding('attr.autocomplete') auto: string;
  constructor(@Attribute('autocomplete') autocomplete: string) {
    this.auto = autocomplete || 'off';
  }
}

@Directive({selector: '[form]'})
export class FormAutocompleteDirective extends AutocompleteDirective {}
