import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  constructor(readonly layout: LayoutService) {}
}
