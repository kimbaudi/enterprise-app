import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.data = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Sales',
          data: [100, 200, 150],
        },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render canvas', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should calculate max value', () => {
    const max = component['getMaxValue']();
    expect(max).toBe(200);
  });

  it('should get color by index', () => {
    expect(component['getColor'](0)).toBe('#3b82f6');
    expect(component['getColor'](1)).toBe('#10b981');
  });

  it('should handle tooltip visibility', () => {
    component['showTooltip'](100, 100, {
      label: 'Jan',
      value: 100,
      datasetIndex: 0,
    });
    expect(component.tooltipVisible()).toBe(true);

    component['hideTooltip']();
    expect(component.tooltipVisible()).toBe(false);
  });
});
