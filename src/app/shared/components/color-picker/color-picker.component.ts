import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent {
  @Input() value: string = '#3b82f6';
  @Input() format: ColorFormat = 'hex';
  @Input() showAlpha: boolean = true;
  @Input() showPresets: boolean = true;
  @Input() showInputs: boolean = true;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() formatChange = new EventEmitter<ColorFormat>();

  // Color state
  currentColor = signal<string>('#3b82f6');
  currentFormat = signal<ColorFormat>('hex');
  hue = signal<number>(217);
  saturation = signal<number>(100);
  lightness = signal<number>(50);
  alpha = signal<number>(1);

  // UI state
  isDraggingSaturation = signal<boolean>(false);
  isDraggingHue = signal<boolean>(false);
  isDraggingAlpha = signal<boolean>(false);

  // Preset colors
  presetColors = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#64748b',
    '#000000',
    '#ffffff',
  ];

  // Recent colors (stored in component state)
  recentColors = signal<string[]>([]);

  // Helper for template
  Math = Math;

  // Computed values
  rgbColor = computed<RGBColor>(() => {
    return this.hslToRgb(this.hue(), this.saturation(), this.lightness(), this.alpha());
  });

  hexValue = computed<string>(() => {
    const rgb = this.rgbColor();
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    return this.showAlpha && rgb.a < 1 ? hex + this.alphaToHex(rgb.a) : hex;
  });

  rgbValue = computed<string>(() => {
    const rgb = this.rgbColor();
    if (this.showAlpha && rgb.a < 1) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)})`;
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  });

  hslValue = computed<string>(() => {
    const h = Math.round(this.hue());
    const s = Math.round(this.saturation());
    const l = Math.round(this.lightness());
    const a = this.alpha();
    if (this.showAlpha && a < 1) {
      return `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`;
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
  });

  currentValue = computed<string>(() => {
    switch (this.currentFormat()) {
      case 'hex':
        return this.hexValue();
      case 'rgb':
        return this.rgbValue();
      case 'hsl':
        return this.hslValue();
      default:
        return this.hexValue();
    }
  });

  saturationGradient = computed<string>(() => {
    const hue = this.hue();
    return `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`;
  });

  alphaGradient = computed<string>(() => {
    const rgb = this.rgbColor();
    return `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1))`;
  });

  constructor() {
    // Initialize from input value
    effect(() => {
      if (this.value) {
        this.parseColor(this.value);
      }
    });

    // Emit changes
    effect(() => {
      const color = this.currentValue();
      this.currentColor.set(color);
      this.valueChange.emit(color);
    });
  }

  // Color conversion utilities
  hslToRgb(h: number, s: number, l: number, a: number = 1): RGBColor {
    s = s / 100;
    l = l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a: a,
    };
  }

  rgbToHsl(r: number, g: number, b: number): HSLColor {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: 1,
    };
  }

  rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  alphaToHex(alpha: number): string {
    const hex = Math.round(alpha * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  parseColor(color: string): void {
    color = color.trim();

    // Parse hex
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

      const hsl = this.rgbToHsl(r, g, b);
      this.hue.set(hsl.h);
      this.saturation.set(hsl.s);
      this.lightness.set(hsl.l);
      this.alpha.set(a);
    }
    // Parse rgb/rgba
    else if (color.startsWith('rgb')) {
      const values = color.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
        const a = values.length === 4 ? parseFloat(values[3]) : 1;

        const hsl = this.rgbToHsl(r, g, b);
        this.hue.set(hsl.h);
        this.saturation.set(hsl.s);
        this.lightness.set(hsl.l);
        this.alpha.set(a);
      }
    }
    // Parse hsl/hsla
    else if (color.startsWith('hsl')) {
      const values = color.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        const h = parseFloat(values[0]);
        const s = parseFloat(values[1]);
        const l = parseFloat(values[2]);
        const a = values.length === 4 ? parseFloat(values[3]) : 1;

        this.hue.set(h);
        this.saturation.set(s);
        this.lightness.set(l);
        this.alpha.set(a);
      }
    }
  }

  // Event handlers for saturation/lightness picker
  onSaturationMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    this.isDraggingSaturation.set(true);
    this.updateSaturationLightness(event);
  }

  onSaturationMouseMove(event: MouseEvent): void {
    if (this.isDraggingSaturation()) {
      this.updateSaturationLightness(event);
    }
  }

  onSaturationMouseUp(): void {
    this.isDraggingSaturation.set(false);
    this.addToRecentColors();
  }

  updateSaturationLightness(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

    const s = (x / rect.width) * 100;
    const l = 100 - (y / rect.height) * 100;

    this.saturation.set(s);
    this.lightness.set(l);
  }

  // Event handlers for hue slider
  onHueMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    this.isDraggingHue.set(true);
    this.updateHue(event);
  }

  onHueMouseMove(event: MouseEvent): void {
    if (this.isDraggingHue()) {
      this.updateHue(event);
    }
  }

  onHueMouseUp(): void {
    this.isDraggingHue.set(false);
  }

  updateHue(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const h = (x / rect.width) * 360;
    this.hue.set(h);
  }

  // Event handlers for alpha slider
  onAlphaMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    this.isDraggingAlpha.set(true);
    this.updateAlpha(event);
  }

  onAlphaMouseMove(event: MouseEvent): void {
    if (this.isDraggingAlpha()) {
      this.updateAlpha(event);
    }
  }

  onAlphaMouseUp(): void {
    this.isDraggingAlpha.set(false);
  }

  updateAlpha(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const a = x / rect.width;
    this.alpha.set(a);
  }

  // Preset color selection
  selectPresetColor(color: string): void {
    if (this.disabled) return;
    this.parseColor(color);
    this.addToRecentColors();
  }

  // Recent colors management
  addToRecentColors(): void {
    const color = this.hexValue();
    const recent = this.recentColors();

    // Remove if already exists
    const filtered = recent.filter((c) => c !== color);

    // Add to beginning and limit to 10
    const updated = [color, ...filtered].slice(0, 10);
    this.recentColors.set(updated);
  }

  // Format switching
  changeFormat(format: ColorFormat): void {
    this.currentFormat.set(format);
    this.formatChange.emit(format);
  }

  // Manual input handlers
  onHexInput(value: string): void {
    if (value.match(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)) {
      this.parseColor(value);
    }
  }

  onRgbInput(r: number, g: number, b: number, a: number = 1): void {
    const hsl = this.rgbToHsl(r, g, b);
    this.hue.set(hsl.h);
    this.saturation.set(hsl.s);
    this.lightness.set(hsl.l);
    this.alpha.set(a);
  }

  onHslInput(h: number, s: number, l: number, a: number = 1): void {
    this.hue.set(h);
    this.saturation.set(s);
    this.lightness.set(l);
    this.alpha.set(a);
  }
}
