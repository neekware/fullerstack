import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@fullerstack/api-interfaces';

@Component({
  selector: 'fullerstack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) {}
}
