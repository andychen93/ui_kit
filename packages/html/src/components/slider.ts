/**
 * Slider component
 *
 * Behavior parity with common slider implementations:
 * - Single value or `range: true` for a dual-handle range slider.
 * - `min`/`max`/`step` control the value domain (defaults 0/100/1).
 * - Drag (mouse + touch) and click-to-seek on the track.
 * - `disabled` blocks all interaction.
 * - `onChange` fires with a `number` in single mode or a full
 *   `[number, number]` tuple in range mode - never a partial/undefined
 *   value.
 */

import * as dom from '../utils/dom';
import { sliderClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export type SliderValue = number | [number, number];

export interface SliderOptions {
  min?: number;
  max?: number;
  step?: number;
  /** Single value (ignored if `range` is true and `rangeValue` is set) */
  value?: number;
  /** Enables dual-handle range mode */
  range?: boolean;
  /** Initial [start, end] tuple, used when `range` is true */
  rangeValue?: [number, number];
  disabled?: boolean;
  onChange?: (value: SliderValue) => void;
  className?: string;
}

interface HandleRefs {
  thumb: HTMLDivElement;
  input: HTMLInputElement;
}

export class Slider {
  private element: HTMLDivElement;
  private options: SliderOptions;
  private trackElement: HTMLDivElement | null = null;
  private filledElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();
  private dragHandleIndex: number | null = null;

  private readonly min: number;
  private readonly max: number;
  private readonly step: number;
  private readonly isRange: boolean;
  private handles: HandleRefs[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: SliderOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this.step = options.step ?? 1;
    this.isRange = options.range ?? false;
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createTrack();
    this.createHandles();
    this.bindEvents();
    this.updatePositions();
  }

  private createTrack(): void {
    const track = dom.createElement('div', {
      className: 'ag-slider-track',
    });
    this.element.appendChild(track);
    this.trackElement = track;

    const filled = dom.createElement('div', {
      className: 'ag-slider-track-filled',
    });
    track.appendChild(filled);
    this.filledElement = filled;
  }

  private createHandles(): void {
    const initial = this.getInitialValue();
    const values = this.isRange ? (initial as [number, number]) : [initial as number];

    values.forEach((val) => {
      const thumb = dom.createElement('div', {
        className: 'ag-slider-thumb',
        attributes: { role: 'slider', tabindex: this.options.disabled ? undefined : '0' },
      });
      this.element.appendChild(thumb);

      const input = dom.createElement('input', {
        className: 'ag-slider-input',
        attributes: { type: 'hidden' },
      });
      input.value = String(val);
      this.element.appendChild(input);

      this.handles.push({ thumb, input });
    });
  }

  private getInitialValue(): SliderValue {
    if (this.isRange) {
      const [start, end] = this.options.rangeValue ?? [this.min, this.max];
      return [this.clamp(start), this.clamp(end)];
    }
    return this.clamp(this.options.value ?? this.min);
  }

  private clamp(value: number): number {
    const stepped = Math.round((value - this.min) / this.step) * this.step + this.min;
    return Math.min(this.max, Math.max(this.min, stepped));
  }

  private valueToPercent(value: number): number {
    if (this.max === this.min) return 0;
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  private percentToValue(percent: number): number {
    const raw = this.min + (percent / 100) * (this.max - this.min);
    return this.clamp(raw);
  }

  private updatePositions(): void {
    if (!this.filledElement) return;

    const values = this.handles.map((h) => parseFloat(h.input.value) || 0);

    this.handles.forEach((handle, index) => {
      const percent = this.valueToPercent(values[index]);
      handle.thumb.style.left = `${percent}%`;
    });

    if (this.isRange && values.length === 2) {
      const startPercent = this.valueToPercent(Math.min(values[0], values[1]));
      const endPercent = this.valueToPercent(Math.max(values[0], values[1]));
      this.filledElement.style.left = `${startPercent}%`;
      this.filledElement.style.width = `${endPercent - startPercent}%`;
    } else {
      const percent = this.valueToPercent(values[0] ?? this.min);
      this.filledElement.style.left = '0%';
      this.filledElement.style.width = `${percent}%`;
    }
  }

  private updateClasses(): void {
    this.element.className = sliderClasses({
      disabled: this.options.disabled,
      className: this.options.className,
    });
  }

  private bindEvents(): void {
    this.handles.forEach((handle, index) => {
      this.eventManager.on<MouseEvent>(handle.thumb, 'mousedown', (e: MouseEvent) => {
        if (this.options.disabled) return;
        e.preventDefault();
        this.dragHandleIndex = index;
      });

      this.eventManager.on<TouchEvent>(handle.thumb, 'touchstart', (e: TouchEvent) => {
        if (this.options.disabled) return;
        this.dragHandleIndex = index;
      });
    });

    this.eventManager.on<MouseEvent>(document, 'mousemove', (e: MouseEvent) => {
      if (this.dragHandleIndex !== null) {
        this.handleDrag(e);
      }
    });

    this.eventManager.on<TouchEvent>(document, 'touchmove', (e: TouchEvent) => {
      if (this.dragHandleIndex !== null) {
        this.handleDrag(e);
      }
    });

    this.eventManager.on<MouseEvent>(document, 'mouseup', () => {
      this.finishDrag();
    });

    this.eventManager.on<TouchEvent>(document, 'touchend', () => {
      this.finishDrag();
    });

    if (this.trackElement) {
      this.eventManager.on<MouseEvent>(this.trackElement, 'click', (e: MouseEvent) => {
        if (this.options.disabled || this.dragHandleIndex !== null) return;
        this.handleTrackClick(e);
      });
    }
  }

  private getClientX(e: MouseEvent | TouchEvent): number {
    if ('touches' in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return (e as MouseEvent).clientX;
  }

  private handleDrag(e: MouseEvent | TouchEvent): void {
    if (!this.trackElement || this.dragHandleIndex === null) return;

    const rect = this.trackElement.getBoundingClientRect();
    const clientX = this.getClientX(e);
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = rect.width === 0 ? 0 : (x / rect.width) * 100;
    const value = this.percentToValue(percent);

    this.setHandleValue(this.dragHandleIndex, value);
  }

  private handleTrackClick(e: MouseEvent): void {
    if (!this.trackElement) return;

    const rect = this.trackElement.getBoundingClientRect();
    const clientX = this.getClientX(e);
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = rect.width === 0 ? 0 : (x / rect.width) * 100;
    const value = this.percentToValue(percent);

    // Move the nearest handle in range mode, or the single handle otherwise.
    const nearestIndex = this.handles.length === 1
      ? 0
      : this.nearestHandleIndex(value);

    this.setHandleValue(nearestIndex, value);
    this.emitChange();
  }

  private nearestHandleIndex(value: number): number {
    let nearest = 0;
    let minDistance = Infinity;
    this.handles.forEach((handle, index) => {
      const distance = Math.abs((parseFloat(handle.input.value) || 0) - value);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = index;
      }
    });
    return nearest;
  }

  private setHandleValue(index: number, value: number): void {
    const handle = this.handles[index];
    if (!handle) return;
    handle.input.value = String(this.clamp(value));
    this.updatePositions();
  }

  private finishDrag(): void {
    if (this.dragHandleIndex === null) return;
    this.dragHandleIndex = null;
    this.emitChange();
  }

  private emitChange(): void {
    if (!this.options.onChange) return;
    this.options.onChange(this.getValue());
  }

  /**
   * Set value. In range mode, pass a full `[number, number]` tuple.
   */
  setValue(value: SliderValue): void {
    if (this.options.disabled) return;

    if (this.isRange && Array.isArray(value)) {
      this.setHandleValue(0, value[0]);
      this.setHandleValue(1, value[1]);
    } else if (!this.isRange && typeof value === 'number') {
      this.setHandleValue(0, value);
    }
  }

  /**
   * Get current value. Returns a `[number, number]` tuple in range mode,
   * or a single `number` otherwise.
   */
  getValue(): SliderValue {
    const values = this.handles.map((h) => parseFloat(h.input.value) || this.min);
    if (this.isRange) {
      return [values[0] ?? this.min, values[1] ?? this.max] as [number, number];
    }
    return values[0] ?? this.min;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
    this.handles.forEach((handle) => {
      if (disabled) {
        handle.thumb.removeAttribute('tabindex');
      } else {
        handle.thumb.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * Whether the slider is disabled
   */
  isDisabled(): boolean {
    return !!this.options.disabled;
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.handles.forEach((handle) => {
      handle.thumb.remove();
      handle.input.remove();
    });
    this.handles = [];
    if (this.trackElement) {
      this.trackElement.remove();
      this.trackElement = null;
    }
  }
}

/**
 * Create slider from scratch
 */
export function createSlider(options: SliderOptions = {}): Slider {
  const container = dom.createElement('div', {
    className: 'ag-slider',
  });

  const instance = new Slider(container, options);
  return instance;
}
