import { Component, OnInit } from '@angular/core';
import {
  style,
  animate,
  transition,
  state,
  trigger,
} from '@angular/animations';

import { I18nService } from '@fullerstack/ngx-i18n';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-180deg)' })),
      transition('rotated => default', animate('400ms ease-out')),
      transition('default => rotated', animate('400ms ease-in')),
    ]),
  ],
})
export class OptionsComponent implements OnInit {
  state: string = 'default';
  isExpanded = false;
  currentLanguage = this.i18n.defaultLanguage;
  constructor(public i18n: I18nService, public layout: LayoutService) {}

  ngOnInit() {}

  private rotate() {
    this.state = this.state === 'default' ? 'rotated' : 'default';
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
    this.rotate();
  }
}
