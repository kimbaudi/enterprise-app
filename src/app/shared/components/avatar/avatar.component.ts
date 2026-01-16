import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() initials = '';
  @Input() icon = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shape: 'circle' | 'square' | 'rounded' = 'circle';
  @Input() status: 'online' | 'offline' | 'away' | 'busy' | '' = '';
  @Input() border = false;

  imageLoadError = false;

  get displayInitials(): string {
    if (!this.initials) return '';
    return this.initials.substring(0, 2).toUpperCase();
  }

  get showImage(): boolean {
    return !!this.src && !this.imageLoadError;
  }

  get showInitials(): boolean {
    return !this.showImage && !!this.initials && !this.icon;
  }

  get showIcon(): boolean {
    return !this.showImage && !this.initials && !!this.icon;
  }

  get showPlaceholder(): boolean {
    return !this.showImage && !this.initials && !this.icon;
  }

  onImageError(): void {
    this.imageLoadError = true;
  }
}
