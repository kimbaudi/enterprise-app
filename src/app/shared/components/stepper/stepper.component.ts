import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepState = 'completed' | 'active' | 'upcoming' | 'error';

export interface Step {
  label: string;
  description?: string;
  icon?: string;
  state?: StepState;
  optional?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  @Input() set steps(value: Step[]) {
    this._steps.set(value);
  }
  get steps(): Step[] {
    return this._steps();
  }
  @Input() set activeStep(value: number) {
    this.currentStep.set(value);
  }
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() linear = false;
  @Input() showNumbers = true;
  @Input() clickable = true;

  @Output() stepChange = new EventEmitter<number>();
  @Output() completed = new EventEmitter<void>();

  private _steps = signal<Step[]>([]);
  currentStep = signal(0);

  totalSteps = computed(() => this._steps().length);
  isFirstStep = computed(() => this.currentStep() === 0);
  isLastStep = computed(() => this.currentStep() === this.totalSteps() - 1);

  getStepState(index: number): StepState {
    const step = this._steps()[index];
    if (step?.state) {
      return step.state;
    }
    if (index < this.currentStep()) {
      return 'completed';
    }
    if (index === this.currentStep()) {
      return 'active';
    }
    return 'upcoming';
  }

  getStepIcon(step: Step, index: number): string {
    const state = this.getStepState(index);

    if (step.icon) {
      return step.icon;
    }

    if (state === 'completed') {
      return '✓';
    }

    if (state === 'error') {
      return '✕';
    }

    if (this.showNumbers) {
      return (index + 1).toString();
    }

    return '';
  }

  canNavigateToStep(index: number): boolean {
    if (!this.clickable) {
      return false;
    }

    const step = this._steps()[index];
    if (step?.disabled) {
      return false;
    }

    if (this.linear) {
      return index <= this.currentStep();
    }

    return true;
  }

  goToStep(index: number): void {
    if (!this.canNavigateToStep(index)) {
      return;
    }

    this.currentStep.set(index);
    this.stepChange.emit(index);
  }

  next(): void {
    if (this.isLastStep()) {
      this.completed.emit();
      return;
    }

    const nextStep = this.currentStep() + 1;
    if (nextStep < this.totalSteps()) {
      this.goToStep(nextStep);
    }
  }

  previous(): void {
    if (!this.isFirstStep()) {
      const prevStep = this.currentStep() - 1;
      this.goToStep(prevStep);
    }
  }

  reset(): void {
    this.currentStep.set(0);
    this.stepChange.emit(0);
  }

  get containerClasses(): string {
    const classes = ['stepper', `stepper-${this.orientation}`];
    return classes.join(' ');
  }

  getStepClasses(index: number): string {
    const step = this._steps()[index];
    const state = this.getStepState(index);
    const classes = ['step', `step-${state}`];

    if (this.canNavigateToStep(index)) {
      classes.push('step-clickable');
    }

    if (step?.disabled) {
      classes.push('step-disabled');
    }

    if (step?.optional) {
      classes.push('step-optional');
    }

    return classes.join(' ');
  }
}
