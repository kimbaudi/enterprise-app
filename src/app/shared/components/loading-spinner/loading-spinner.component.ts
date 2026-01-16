import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  private loadingService = inject(LoadingService);
  loading = toSignal(this.loadingService.loading$, { initialValue: false });
}
