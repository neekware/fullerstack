/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { AnnotatorService } from '../../annotator.service';

@Component({
  selector: 'fullerstack-hide-menu',
  templateUrl: './hide.component.html',
  styleUrls: ['./hide.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HideMenuComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(readonly annotation: AnnotatorService) {}

  showTrashButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showTrashButton: !this.annotation.state.menuOptions.showTrashButton,
      },
    });
  }

  showUndoButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showUndoButton: !this.annotation.state.menuOptions.showUndoButton,
      },
    });
  }

  showRedoButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showRedoButton: !this.annotation.state.menuOptions.showRedoButton,
      },
    });
  }

  showLineWidthButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showLineWidthButton: !this.annotation.state.menuOptions.showLineWidthButton,
      },
    });
  }

  showCursorButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showCursorButton: !this.annotation.state.menuOptions.showCursorButton,
      },
    });
  }

  showFullscreenButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showFullscreenButton: !this.annotation.state.menuOptions.showFullscreenButton,
      },
    });
  }

  showRefreshButton() {
    this.annotation.setState({
      menuOptions: {
        ...this.annotation.state.menuOptions,
        showRefreshButton: !this.annotation.state.menuOptions.showRefreshButton,
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
