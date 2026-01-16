import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    component.slides = [
      { id: 1, image: 'image1.jpg', title: 'Slide 1' },
      { id: 2, image: 'image2.jpg', title: 'Slide 2' },
      { id: 3, image: 'image3.jpg', title: 'Slide 3' },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to next slide', () => {
    component.currentIndex.set(0);
    component.next();
    expect(component.currentIndex()).toBe(1);
  });

  it('should navigate to previous slide', () => {
    component.currentIndex.set(1);
    component.previous();
    expect(component.currentIndex()).toBe(0);
  });

  it('should loop to first slide when at end with loop enabled', () => {
    component.config.loop = true;
    component.currentIndex.set(2);
    component.next();
    expect(component.currentIndex()).toBe(0);
  });

  it('should not navigate beyond bounds when loop disabled', () => {
    component.config.loop = false;
    component.currentIndex.set(2);
    component.next();
    expect(component.currentIndex()).toBe(2);
  });

  it('should go to specific slide', () => {
    component.goToSlide(1);
    expect(component.currentIndex()).toBe(1);
  });

  it('should emit slideChange event', () => {
    jest.spyOn(component.slideChange, 'emit');
    component.goToSlide(1);
    expect(component.slideChange.emit).toHaveBeenCalledWith(1);
  });

  it('should handle swipe gestures', () => {
    component.currentIndex.set(0);
    component.touchStartX.set(100);
    component.touchEndX.set(50);
    component.onTouchEnd();
    expect(component.currentIndex()).toBe(1);
  });

  it('should toggle play/pause', () => {
    component.isPlaying.set(false);
    component.togglePlayPause();
    expect(component.isPlaying()).toBe(true);
  });

  it('should cleanup auto-play on destroy', () => {
    component.config.autoPlay = true;
    component.isPlaying.set(true);
    jest.spyOn(component, 'stopAutoPlay');
    component.ngOnDestroy();
    expect(component.stopAutoPlay).toHaveBeenCalled();
  });
});
