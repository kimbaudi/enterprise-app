import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  effect,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface CarouselSlide {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  alt?: string;
}

export interface CarouselConfig {
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  transition?: 'slide' | 'fade';
  height?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnDestroy {
  @Input() slides: CarouselSlide[] = [];
  @Input() config: CarouselConfig = {
    autoPlay: false,
    interval: 3000,
    showIndicators: true,
    showArrows: true,
    showThumbnails: false,
    loop: true,
    pauseOnHover: true,
    transition: 'slide',
    height: '400px',
    objectFit: 'cover',
  };

  @Output() slideChange = new EventEmitter<number>();
  @Output() slideClick = new EventEmitter<CarouselSlide>();

  // State
  currentIndex = signal(0);
  isPlaying = signal(false);
  isHovered = signal(false);
  isFullscreen = signal(false);
  touchStartX = signal(0);
  touchEndX = signal(0);

  private autoPlayInterval: any = null;

  constructor() {
    // Auto-play effect
    effect(() => {
      if (this.config.autoPlay && this.isPlaying() && !this.isHovered()) {
        this.startAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // Computed values
  currentSlide = computed(() => this.slides[this.currentIndex()] || null);

  canGoPrevious = computed(() => {
    return this.config.loop || this.currentIndex() > 0;
  });

  canGoNext = computed(() => {
    return this.config.loop || this.currentIndex() < this.slides.length - 1;
  });

  // Navigation methods
  goToSlide(index: number) {
    if (index < 0 || index >= this.slides.length) return;
    this.currentIndex.set(index);
    this.slideChange.emit(index);
  }

  previous() {
    if (!this.canGoPrevious()) return;

    let newIndex = this.currentIndex() - 1;
    if (newIndex < 0 && this.config.loop) {
      newIndex = this.slides.length - 1;
    }
    this.goToSlide(newIndex);
  }

  next() {
    if (!this.canGoNext()) return;

    let newIndex = this.currentIndex() + 1;
    if (newIndex >= this.slides.length && this.config.loop) {
      newIndex = 0;
    }
    this.goToSlide(newIndex);
  }

  // Auto-play controls
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, this.config.interval || 3000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  togglePlayPause() {
    this.isPlaying.set(!this.isPlaying());
  }

  // Mouse events
  onMouseEnter() {
    if (this.config.pauseOnHover) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }

  // Touch/swipe support
  onTouchStart(event: TouchEvent) {
    this.touchStartX.set(event.touches[0].clientX);
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX.set(event.touches[0].clientX);
  }

  onTouchEnd() {
    const startX = this.touchStartX();
    const endX = this.touchEndX();
    const threshold = 50;

    if (startX - endX > threshold) {
      // Swipe left
      this.next();
    } else if (endX - startX > threshold) {
      // Swipe right
      this.previous();
    }

    this.touchStartX.set(0);
    this.touchEndX.set(0);
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case ' ':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        if (this.isFullscreen()) {
          this.exitFullscreen();
        }
        break;
    }
  }

  // Fullscreen
  toggleFullscreen() {
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  enterFullscreen() {
    this.isFullscreen.set(true);
    document.body.style.overflow = 'hidden';
  }

  exitFullscreen() {
    this.isFullscreen.set(false);
    document.body.style.overflow = '';
  }

  // Slide click
  onSlideClick(slide: CarouselSlide) {
    this.slideClick.emit(slide);
  }

  // Helpers
  getSlideTransform(): string {
    if (this.config.transition === 'fade') {
      return 'translateX(0)';
    }
    return `translateX(-${this.currentIndex() * 100}%)`;
  }
}
