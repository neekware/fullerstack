import { Injectable } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { SystemService } from '@fullerstack/ngx-system';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService {
  constructor(readonly system: SystemService, readonly layout: LayoutService) {}
}
