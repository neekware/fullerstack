import { Injectable } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService {
  constructor(readonly layout: LayoutService) {}
}
