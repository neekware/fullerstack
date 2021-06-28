/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  tmpLet: T;
  $implicit: T; // $implicit in the context object will set its value as default
}

// https://github.com/ngrx-utils/ngrx-utils/blob/master/libs/store/src/lib/directives/ngLet.ts
@Directive({
  selector: '[tmpLet]',
})
export class TmpLetDirective<T> {
  private context: LetContext<T> = { tmpLet: undefined, $implicit: undefined };
  @Input()
  set tmpLet(value: T) {
    this.context = { tmpLet: value, $implicit: value };
  }

  constructor(readonly vcRef: ViewContainerRef, readonly tRef: TemplateRef<LetContext<T>>) {
    this.vcRef.createEmbeddedView(this.tRef, this.context);
  }
}
