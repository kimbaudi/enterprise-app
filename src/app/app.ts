import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Enterprise Angular App';
}
