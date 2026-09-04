/**
 * Spin component
 */

import { ComponentSize, ComponentVariant } from '../types/index';
import * as dom from '../utils/dom';
import { spinnerClasses } from '../utils/css-classes';

export interface SpinOptions {
  size?: ComponentSize;
  variant?: ComponentVariant;
  spinning?: boolean;
  tip?: string;
  className?: string;
}

export class Spin {
  private element: HTMLDivElement;
  private options: SpinOptions;
  private tipElement: HTMLDivElement | null = null;
  private spinnerElement: HTMLDivElement | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: SpinOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      spinning: true,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createSpinner();
    if (this.options.tip) {
      this.createTip();
    }
    if (!this.options.spinning) {
      this.hide();
    }
  }

  private createSpinner(): void {
    const spinner = dom.createElement('div', {
      className: 'ag-spin-dot',
    });

    const inner = dom.createElement('div', {
      className: 'ag-spin-dot-inner',
    });
    spinner.appendChild(inner);

    this.element.appendChild(spinner);
    this.spinnerElement = spinner;
  }

  private createTip(): void {
    const tip = dom.createElement('div', {
      className: 'ag-spin-text',
      textContent: this.options.tip,
    });
    this.element.appendChild(tip);
    this.tipElement = tip;
  }

  private updateClasses(): void {
    const classes = spinnerClasses({
      size: this.options.size,
      variant: this.options.variant,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Show spinner
   */
  show(): void {
    this.options.spinning = true;
    this.element.style.display = 'block';
  }

  /**
   * Hide spinner
   */
  hide(): void {
    this.options.spinning = false;
    this.element.style.display = 'none';
  }

  /**
   * Set spinning state
   */
  setSpinning(spinning: boolean): void {
    this.options.spinning = spinning;
    if (spinning) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Set tip text
   */
  setTip(tip: string): void {
    this.options.tip = tip;
    if (this.tipElement) {
      this.tipElement.textContent = tip;
    }
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Set variant
   */
  setVariant(variant: ComponentVariant): void {
    this.options.variant = variant;
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
    if (this.spinnerElement) {
      this.spinnerElement.remove();
    }
    if (this.tipElement) {
      this.tipElement.remove();
    }
  }
}

/**
 * Create spin from scratch
 */
export function createSpin(options: SpinOptions = {}): Spin {
  const container = dom.createElement('div', {
    className: 'ag-spin',
  });

  const instance = new Spin(container, options);
  return instance;
}
