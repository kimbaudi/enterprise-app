import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Directive({
    selector: '[appHasRole]',
    standalone: true,
})
export class HasRoleDirective implements OnInit {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    @Input() appHasRole: string[] = [];

    ngOnInit(): void {
        this.updateView();
    }

    private updateView(): void {
        if (this.authService.hasAnyRole(this.appHasRole)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
