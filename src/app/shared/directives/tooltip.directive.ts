import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  ComponentRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipContent = '';
  @Input() tooltipPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() tooltipDisabled = false;

  private tooltipRef: ComponentRef<TooltipComponent> | null = null;
  private showTimeout?: number;
  private hideTimeout?: number;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.tooltipDisabled || !this.tooltipContent) return;

    // Clear any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }

    // Show after a short delay
    this.showTimeout = window.setTimeout(() => {
      this.show();
    }, 200);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Clear any pending show
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }

    // Hide after a short delay
    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, 100);
  }

  @HostListener('click')
  onClick(): void {
    this.hide();
  }

  private show(): void {
    if (this.tooltipRef) return;

    // Create tooltip component
    this.tooltipRef = this.viewContainerRef.createComponent(TooltipComponent);
    this.tooltipRef.instance.content = this.tooltipContent;
    this.tooltipRef.instance.position = this.tooltipPosition;
    this.tooltipRef.instance.visible = true;

    // Append to body for proper positioning
    const tooltipElement = this.tooltipRef.location.nativeElement;
    document.body.appendChild(tooltipElement);

    // Position the tooltip
    this.positionTooltip();
  }

  private hide(): void {
    if (this.tooltipRef) {
      const tooltipElement = this.tooltipRef.location.nativeElement;
      if (tooltipElement.parentNode) {
        tooltipElement.parentNode.removeChild(tooltipElement);
      }
      this.tooltipRef.destroy();
      this.tooltipRef = null;
    }
  }

  private positionTooltip(): void {
    if (!this.tooltipRef) return;

    const hostElement = this.elementRef.nativeElement;
    const tooltipElement = this.tooltipRef.location.nativeElement;
    const hostRect = hostElement.getBoundingClientRect();

    tooltipElement.style.position = 'fixed';

    switch (this.tooltipPosition) {
      case 'top':
        tooltipElement.style.left = `${hostRect.left + hostRect.width / 2}px`;
        tooltipElement.style.top = `${hostRect.top}px`;
        break;
      case 'right':
        tooltipElement.style.left = `${hostRect.right}px`;
        tooltipElement.style.top = `${hostRect.top + hostRect.height / 2}px`;
        break;
      case 'bottom':
        tooltipElement.style.left = `${hostRect.left + hostRect.width / 2}px`;
        tooltipElement.style.top = `${hostRect.bottom}px`;
        break;
      case 'left':
        tooltipElement.style.left = `${hostRect.left}px`;
        tooltipElement.style.top = `${hostRect.top + hostRect.height / 2}px`;
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hide();
  }
}
