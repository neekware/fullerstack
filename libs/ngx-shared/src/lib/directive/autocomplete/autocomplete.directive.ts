/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @angular-eslint/directive-selector */
import { Attribute, Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[autoCompleteOff]',
})
export class AutocompleteDirective {
  @HostBinding('attr.autocomplete') auto: string;
  constructor(@Attribute('autocomplete') autocomplete: string) {
    this.auto = autocomplete || 'off';
  }
}
