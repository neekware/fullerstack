import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@fullerstack/ngx-layout';
import { SystemService } from '@fullerstack/ngx-system';
import { Subject, filter, pairwise, takeUntil, tap } from 'rxjs';

import { ANNOTATOR_URL } from './annotator.model';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly layout: LayoutService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pairwise(),
        tap(([lastRoute, currentRoute]) => {
          if ((currentRoute as NavigationEnd).url?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(true);
          } else if ((lastRoute as NavigationEnd).url?.startsWith(ANNOTATOR_URL)) {
            this.layout.setHeadless(false);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
