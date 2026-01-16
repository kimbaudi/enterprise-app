import { Directive, ElementRef, EventEmitter, Output, inject, afterNextRender } from '@angular/core';

/**
 * Directive to detect clicks outside of the host element
 * Usage: <div (appClickOutside)="handleClickOutside()">Content</div>
 */
@Directive({
    selector: '[appClickOutside]',
    standalone: true,
})
export class ClickOutsideDirective {
    private elementRef = inject(ElementRef);

    @Output() appClickOutside = new EventEmitter<MouseEvent>();

    constructor() {
        afterNextRender(() => {
            this.initListener();
        });
    }

    private initListener(): void {
        const clickListener = (event: MouseEvent) => {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.appClickOutside.emit(event);
            }
        };

        document.addEventListener('click', clickListener);

        // Cleanup on destroy
        const originalOnDestroy = this.ngOnDestroy;
        this.ngOnDestroy = () => {
            document.removeEventListener('click', clickListener);
            if (originalOnDestroy) {
                originalOnDestroy.call(this);
            }
        };
    }

    ngOnDestroy(): void {
        // This will be replaced by the cleanup function
    }
}
