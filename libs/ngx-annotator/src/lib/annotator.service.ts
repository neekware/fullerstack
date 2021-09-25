import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@fullerstack/ngx-layout';
import { SystemService } from '@fullerstack/ngx-system';
import { Subject, filter, takeUntil } from 'rxjs';

import { ANNOTATOR_URL } from './annotator.model';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  private lastUrl: string;

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly layout: LayoutService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          if (this.router.url?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(true);
          } else if (this.lastUrl?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(false);
          }
          this.lastUrl = this.router.url;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
