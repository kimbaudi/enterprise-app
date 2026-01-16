import {
  Injectable,
  inject,
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { ModalComponent } from './modal.component';

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private modals: ComponentRef<ModalComponent>[] = [];

  open(config: ModalConfig = {}): ModalComponent {
    const modalRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
    });

    const instance = modalRef.instance as ModalComponent;

    // Apply config
    if (config.title) instance.title = config.title;
    if (config.size) instance.size = config.size;
    if (config.closeOnBackdrop !== undefined) instance.closeOnBackdrop = config.closeOnBackdrop;
    if (config.closeOnEsc !== undefined) instance.closeOnEsc = config.closeOnEsc;
    if (config.showClose !== undefined) instance.showClose = config.showClose;
    instance.isOpen = true;

    // Attach to app
    this.appRef.attachView(modalRef.hostView);
    const domElem = (modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Track modal
    this.modals.push(modalRef);

    // Handle close
    instance.closeEvent.subscribe(() => {
      this.close(modalRef);
    });

    return instance;
  }

  close(modalRef: ComponentRef<ModalComponent>): void {
    const index = this.modals.indexOf(modalRef);
    if (index > -1) {
      this.modals.splice(index, 1);
    }

    this.appRef.detachView(modalRef.hostView);
    modalRef.destroy();
  }

  closeAll(): void {
    this.modals.forEach((modal) => this.close(modal));
  }
}
