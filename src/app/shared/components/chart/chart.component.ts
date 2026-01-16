import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animationDuration?: number;
  height?: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'bar';
  @Input() data: ChartData = { labels: [], datasets: [] };
  @Input() options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
    animationDuration: 500,
    height: 300,
  };

  @Output() chartClick = new EventEmitter<{ label: string; value: number; datasetIndex: number }>();

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private animationProgress = 0;

  // Tooltip state
  tooltipVisible = signal(false);
  tooltipX = signal(0);
  tooltipY = signal(0);
  tooltipLabel = signal('');
  tooltipValue = signal('');

  ngAfterViewInit() {
    this.initChart();
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['data'] || changes['type']) && this.ctx) {
      this.renderChart();
    }
  }

  private initChart() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (this.options.responsive) {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    // Add mouse move listener for tooltips
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    canvas.addEventListener('mouseleave', () => this.hideTooltip());
    canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = this.options.height || 300;
      if (this.ctx) {
        this.renderChart();
      }
    }
  }

  private renderChart() {
    if (!this.ctx) return;

    // Clear canvas
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animate
    this.animationProgress = 0;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animate();
  }

  private animate() {
    const duration = this.options.animationDuration || 500;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      this.animationProgress = Math.min(elapsed / duration, 1);

      this.draw();

      if (this.animationProgress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      }
    };

    step();
  }

  private draw() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (this.type) {
      case 'line':
      case 'area':
        this.drawLineChart();
        break;
      case 'bar':
        this.drawBarChart();
        break;
      case 'pie':
      case 'doughnut':
        this.drawPieChart();
        break;
    }

    if (this.options.showLegend) {
      this.drawLegend();
    }
  }

  private drawLineChart() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw grid
    if (this.options.showGrid) {
      this.drawGrid(padding, chartWidth, chartHeight);
    }

    // Draw axes
    this.drawAxes(padding, chartWidth, chartHeight);

    // Get max value
    const maxValue = this.getMaxValue();
    const xStep = chartWidth / (this.data.labels.length - 1 || 1);

    // Draw datasets
    this.data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.borderColor || this.getColor(datasetIndex);

      this.ctx!.strokeStyle = color;
      this.ctx!.lineWidth = dataset.borderWidth || 2;
      this.ctx!.beginPath();

      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = padding + chartHeight - (value / maxValue) * chartHeight * this.animationProgress;

        if (index === 0) {
          this.ctx!.moveTo(x, y);
        } else {
          this.ctx!.lineTo(x, y);
        }
      });

      this.ctx!.stroke();

      // Fill area if type is area
      if (this.type === 'area' && dataset.fill !== false) {
        this.ctx!.lineTo(padding + (dataset.data.length - 1) * xStep, padding + chartHeight);
        this.ctx!.lineTo(padding, padding + chartHeight);
        this.ctx!.closePath();
        this.ctx!.fillStyle = color + '33'; // 20% opacity
        this.ctx!.fill();
      }

      // Draw points
      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = padding + chartHeight - (value / maxValue) * chartHeight * this.animationProgress;

        this.ctx!.beginPath();
        this.ctx!.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx!.fillStyle = color;
        this.ctx!.fill();
      });
    });

    // Draw labels
    this.drawLabels(padding, chartWidth, chartHeight);
  }

  private drawBarChart() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw grid
    if (this.options.showGrid) {
      this.drawGrid(padding, chartWidth, chartHeight);
    }

    // Draw axes
    this.drawAxes(padding, chartWidth, chartHeight);

    const maxValue = this.getMaxValue();
    const barWidth = chartWidth / this.data.labels.length;
    const barSpacing = barWidth * 0.1;
    const actualBarWidth = (barWidth - barSpacing * 2) / this.data.datasets.length;

    this.data.datasets.forEach((dataset, datasetIndex) => {
      const colors = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor
        : [dataset.backgroundColor || this.getColor(datasetIndex)];

      dataset.data.forEach((value, index) => {
        const x = padding + index * barWidth + barSpacing + datasetIndex * actualBarWidth;
        const barHeight = (value / maxValue) * chartHeight * this.animationProgress;
        const y = padding + chartHeight - barHeight;

        this.ctx!.fillStyle = colors[index % colors.length];
        this.ctx!.fillRect(x, y, actualBarWidth, barHeight);
      });
    });

    // Draw labels
    this.drawLabels(padding, chartWidth, chartHeight);
  }

  private drawPieChart() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;

    const dataset = this.data.datasets[0];
    const total = dataset.data.reduce((sum, val) => sum + val, 0);

    let startAngle = -Math.PI / 2;

    dataset.data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2 * this.animationProgress;
      const endAngle = startAngle + sliceAngle;

      const colors = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor
        : [this.getColor(index)];

      this.ctx!.beginPath();
      this.ctx!.arc(centerX, centerY, radius, startAngle, endAngle);

      if (this.type === 'doughnut') {
        this.ctx!.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true);
      } else {
        this.ctx!.lineTo(centerX, centerY);
      }

      this.ctx!.closePath();
      this.ctx!.fillStyle = colors[index % colors.length];
      this.ctx!.fill();

      // Draw percentage label
      if (sliceAngle > 0.2) {
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * (this.type === 'doughnut' ? 0.8 : 0.7);
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        const percentage = ((value / total) * 100).toFixed(1);
        this.ctx!.fillStyle = '#fff';
        this.ctx!.font = 'bold 12px sans-serif';
        this.ctx!.textAlign = 'center';
        this.ctx!.textBaseline = 'middle';
        this.ctx!.fillText(`${percentage}%`, labelX, labelY);
      }

      startAngle = endAngle;
    });
  }

  private drawGrid(padding: number, width: number, height: number) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(padding + width, y);
      this.ctx.stroke();
    }
  }

  private drawAxes(padding: number, width: number, height: number) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 2;

    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, padding + height);
    this.ctx.stroke();

    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding + height);
    this.ctx.lineTo(padding + width, padding + height);
    this.ctx.stroke();
  }

  private drawLabels(padding: number, width: number, height: number) {
    if (!this.ctx) return;

    this.ctx.fillStyle = '#6b7280';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';

    const xStep = width / this.data.labels.length;

    this.data.labels.forEach((label, index) => {
      const x = padding + index * xStep + xStep / 2;
      const y = padding + height + 20;
      this.ctx!.fillText(label, x, y);
    });
  }

  private drawLegend() {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const legendY = canvas.height - 25;
    let legendX = 10;

    this.ctx.font = '12px sans-serif';

    this.data.datasets.forEach((dataset, index) => {
      const color = dataset.borderColor || this.getColor(index);

      // Draw color box
      this.ctx!.fillStyle = color;
      this.ctx!.fillRect(legendX, legendY, 12, 12);

      // Draw label
      this.ctx!.fillStyle = '#374151';
      this.ctx!.textAlign = 'left';
      this.ctx!.fillText(dataset.label, legendX + 18, legendY + 10);

      legendX += this.ctx!.measureText(dataset.label).width + 35;
    });
  }

  private getMaxValue(): number {
    let max = 0;
    this.data.datasets.forEach((dataset) => {
      const datasetMax = Math.max(...dataset.data);
      if (datasetMax > max) max = datasetMax;
    });
    return max || 100;
  }

  private getColor(index: number): string {
    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
      '#06b6d4',
      '#84cc16',
    ];
    return colors[index % colors.length];
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.options.showTooltip) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find data point near mouse
    const dataPoint = this.findDataPoint(x, y);

    if (dataPoint) {
      this.showTooltip(x, y, dataPoint);
    } else {
      this.hideTooltip();
    }
  }

  private findDataPoint(
    mouseX: number,
    mouseY: number,
  ): { label: string; value: number; datasetIndex: number } | null {
    const canvas = this.canvasRef.nativeElement;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = this.getMaxValue();

    if (this.type === 'line' || this.type === 'area') {
      const xStep = chartWidth / (this.data.labels.length - 1 || 1);

      for (let i = 0; i < this.data.labels.length; i++) {
        const x = padding + i * xStep;

        if (Math.abs(mouseX - x) < 10) {
          for (let j = 0; j < this.data.datasets.length; j++) {
            const value = this.data.datasets[j].data[i];
            const y = padding + chartHeight - (value / maxValue) * chartHeight;

            if (Math.abs(mouseY - y) < 10) {
              return {
                label: this.data.labels[i],
                value: value,
                datasetIndex: j,
              };
            }
          }
        }
      }
    }

    return null;
  }

  private showTooltip(
    x: number,
    y: number,
    dataPoint: { label: string; value: number; datasetIndex: number },
  ) {
    this.tooltipVisible.set(true);
    this.tooltipX.set(x);
    this.tooltipY.set(y);
    this.tooltipLabel.set(dataPoint.label);
    this.tooltipValue.set(
      `${this.data.datasets[dataPoint.datasetIndex].label}: ${dataPoint.value}`,
    );
  }

  private hideTooltip() {
    this.tooltipVisible.set(false);
  }

  private handleClick(e: MouseEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dataPoint = this.findDataPoint(x, y);
    if (dataPoint) {
      this.chartClick.emit(dataPoint);
    }
  }
}
