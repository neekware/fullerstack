/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { I18nService } from '@fullerstack/ngx-i18n';
import { expansionAnimations, fadeAnimations, rotationAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  animations: [
    rotationAnimations.rotate180,
    expansionAnimations.expandFade,
    fadeAnimations.fadeOutInSlow,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent implements OnInit, OnDestroy {
  rotateState = 'default';
  optionState = 'expanded';
  optionTitleState = 'collapsed';
  currentLanguage: string;
  isExpanded = false;
  hideOptionTitle = false;
  isDarkTheme = false;
  private destroy$ = new Subject<boolean>();

  constructor(public i18n: I18nService, public layout: LayoutService) {
    this.currentLanguage = this.i18n.defaultLanguage;
    this.isDarkTheme = this.layout.isDarkTheme;
  }

  ngOnInit() {
    this.i18n.stateChange$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (iso) => {
        this.currentLanguage = iso;
      },
    });
  }

  private rotateButton() {
    this.rotateState = this.rotateState === 'back' ? 'forth' : 'back';
    this.hideOptionTitle = this.rotateState === 'back' ? false : true;
  }

  private expandOptions() {
    this.optionState = this.optionState === 'collapsed' ? 'expanded' : 'collapsed';
    this.optionTitleState = this.optionTitleState === 'collapsed' ? 'expanded' : 'collapsed';
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
    this.rotateButton();
    this.expandOptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
