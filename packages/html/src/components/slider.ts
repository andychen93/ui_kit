/**
 * Slider component
 */

import { EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { sliderClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface SliderOptions {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export class Slider {
  private element: HTMLDivElement;
  private options: SliderOptions;
  private trackElement: HTMLDivElement | null = null;
  private thumbElement: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private eventManager = new EventManager();
  private isDragging: boolean = false;

  constructor(
    element: HTMLDivElement | string,
    options: SliderOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      min: 0,
      max: 100,
      step: 1,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createTrack();
    this.createInput();
    this.bindEvents();
    this.updatePosition();
  }

  private createTrack(): void {
    const track = dom.createElement('div', {
      className: 'ag-slider-track',
    });
    this.element.appendChild(track);
    this.trackElement = track;

    const filledTrack = dom.createElement('div', {
      className: 'ag-slider-track-filled',
    });
    track.appendChild(filledTrack);
  }

  private createThumb(): void {
    const thumb = dom.createElement('div', {
      className: 'ag-slider-thumb',
    });
    this.element.appendChild(thumb);
    this.thumbElement = thumb;
  }

  private createInput(): void {
    const input = dom.createElement('input', {
      type: 'hidden',
      className: 'ag-slider-input',
    });
    this.element.appendChild(input);
    this.inputElement = input;
    
    if (this.options.value !== undefined) {
      this.inputElement.value = String(this.options.value);
    }
  }

  private updatePosition(): void {
    if (!this.trackElement || !this.thumbElement || !this.inputElement) return;

    const value = parseFloat(this.inputElement.value) || 0;
    const percent = ((value - this.options.min) / (this.options.max - this.options.min)) * 100;

    if (this.thumbElement) {
      this.thumbElement.style.left = `${percent}%`;
    }

    const filledTrack = this.trackElement.querySelector('.ag-slider-track-filled');
    if (filledTrack) {
      filledTrack.style.width = `${percent}%`;
    }
  }

  private updateClasses(): void {
    const classes = sliderClasses({
      disabled: this.options.disabled,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    if (this.thumbElement) {
      this.eventManager.on(this.thumbElement, 'mousedown', (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.handleDrag(e);
      });

      this.eventManager.on(document, 'mousemove', (e) => {
        if (this.isDragging) {
          this.handleDrag(e);
        }
      });

      this.eventManager.on(document, 'mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.updateValue();
        }
      });

      this.eventManager.on(this.element, 'click', (e) => {
        if (!this.isDragging) {
          this.handleClick(e);
        }
      });
    }
  }

  private handleDrag(e: MouseEvent | TouchEvent): void {
    if (!this.trackElement) return;

    const rect = this.trackElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    
    const percent = (x / rect.width) * 100;
    const value = this.percentToValue(percent);
    
    this.setValue(value);
    this.updatePosition();
  }

  private handleClick(e: MouseEvent | TouchEvent): void {
    if (!this.trackElement || this.options.disabled) return;

    const rect = this.trackElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    
    const percent = (x / rect.width) * 100;
    const value = this.percentToValue(percent);
    
    this.setValue(value);
    this.updatePosition();
    
    if (this.options.onChange) {
      this.options.onChange(value);
    }
  }

  private percentToValue(percent: number): number {
    const value = this.options.min + (percent / 100) * (this.options.max - this.options.min);
    const steppedValue = Math.round((value - this.options.min) / this.options.step) * this.options.step + this.options.min;
    return Math.min(this.options.max, Math.max(this.options.min, steppedValue));
  }

  private updateValue(): void {
    if (!this.inputElement) return;
    
    const value = parseFloat(this.inputElement.value);
    
    if (this.options.onChange) {
      this.options.onChange(value);
    }
  }

  /**
   * Set value
   */
  setValue(value: number): void {
    if (this.options.disabled) return;
    
    const clampedValue = Math.min(this.options.max, Math.max(this.options.min, value));
    this.inputElement!.value = String(clampedValue);
    this.updatePosition();
  }

  /**
   * Get value
   */
  getValue(): number {
    if (!this.inputElement) return 0;
    return parseFloat(this.inputElement.value) || 0;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
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
    if (this.trackElement) {
      this.trackElement.remove();
    }
    if (this.thumbElement) {
      this.thumbElement.remove();
    }
    if (this.inputElement) {
      this.inputElement.remove();
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
