import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  private el = inject(ElementRef);

  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'transparent';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
