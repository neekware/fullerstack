import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fullerstack-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() color = 'primary';
  @Input() text = '';

  constructor(readonly translate: TranslateService) {}
}
