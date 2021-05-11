import { Component, Input, OnInit } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { I18nService } from '@fullerstack/ngx-i18n';

import { shakeAnimations } from '../../animation/animation.shake';

@Component({
  selector: 'fullerstack-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [shakeAnimations.wiggleIt],
})
export class CardComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  subtitle: string = null;
  @Input()
  icon: string = null;
  @Input()
  iconColor: string = null;
  @Input()
  menu: any = [];
  @Input()
  progress = false;

  wiggleState = 'back';
  hasMenu = false;
  isMainColor = true;
  optionMenuTooltipPosition: TooltipPosition;

  constructor(readonly i18n: I18nService) {}

  ngOnInit() {
    if (!this.title) {
      throw Error('Required input missing. (title)');
    }
    if (this.hasMenu && this.icon) {
      throw Error('Multiple inputs. Use icon or menu or neither');
    }
    this.hasMenu = this.menu && this.menu.length > 0;
    this.isMainColor = ['primary', 'accent', 'warn'].some((value) => value === this.iconColor);

    this.setPosition();
  }

  setPosition() {
    const position = this.i18n.direction === 'ltr' ? 'left' : 'right';
    this.optionMenuTooltipPosition = position as TooltipPosition;
  }
}
