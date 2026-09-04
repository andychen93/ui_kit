/**
 * Progress component
 */

import { ComponentVariant, ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { progressClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface ProgressOptions {
  percent?: number;
  size?: ComponentSize;
  variant?: ComponentVariant;
  type?: 'line' | 'circle' | 'dashboard';
  status?: 'normal' | 'active' | 'success' | 'exception';
  format?: (percent: number) => string;
  className?: string;
}


/**
 * Create SVG element with attributes
 */
function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  options?: {
    className?: string | string[];
    attributes?: Record<string, string | undefined>;
    dataset?: Record<string, string>;
    innerHTML?: string;
    textContent?: string;
  }
): SVGElementTagNameMap[K] {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  if (options?.className) {
    const classVal = typeof options.className === 'string' 
      ? options.className 
      : options.className.filter(Boolean).join(' ');
    if (classVal) {
      element.setAttribute('class', classVal);
    }
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        element.setAttribute(key, value);
      }
    });
  }

  if (options?.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }

  if (options?.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  if (options?.textContent) {
    element.textContent = options.textContent;
  }

  return element;
}


export class Progress {
  private element: HTMLDivElement;
  private options: ProgressOptions;
  private trackElement: HTMLDivElement | null = null;
  private successElement: HTMLDivElement | null = null;
  private indicatorElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: ProgressOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      percent: 0,
      size: 'md',
      type: 'line',
      status: 'normal',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createProgress();
  }

  private createProgress(): void {
    if (this.options.type === 'line') {
      this.createLineProgress();
    } else {
      this.createCircleProgress();
    }
  }

  private createLineProgress(): void {
    const track = dom.createElement('div', {
      className: 'ag-progress-track',
    });
    
    const success = dom.createElement('div', {
      className: 'ag-progress-success',
    });
    track.appendChild(success);
    this.successElement = success;

    const indicator = dom.createElement('div', {
      className: 'ag-progress-indicator',
    });
    track.appendChild(indicator);
    this.indicatorElement = indicator;

    this.element.appendChild(track);
    this.trackElement = track;

    if (this.options.format) {
      this.createText();
    }
    
    this.updateProgress();
  }

  private createCircleProgress(): void {
    const svg = createSVGElement('svg', {
      className: 'ag-progress-circle',
      attributes: {
        viewBox: '0 0 100 100',
      },
    });

    const circle = createSVGElement('circle', {
      className: 'ag-progress-circle-bg',
      attributes: {
        cx: '50',
        cy: '50',
        r: '40',
      },
    });
    svg.appendChild(circle);

    const circleTrack = createSVGElement('circle', {
      className: 'ag-progress-circle-track',
      attributes: {
        cx: '50',
        cy: '50',
        r: '40',
        strokeDasharray: '251.2',
        strokeDashoffset: '251.2',
      },
    });
    svg.appendChild(circleTrack);
    
    const circleSuccess = createSVGElement('circle', {
      className: 'ag-progress-circle-success',
      attributes: {
        cx: '50',
        cy: '50',
        r: '40',
        strokeDasharray: '251.2',
        strokeDashoffset: '251.2',
      },
    });
    svg.appendChild(circleSuccess);

    this.element.appendChild(svg);

    if (this.options.format) {
      this.createText();
    }
    
    this.updateProgress();
  }

  private createText(): void {
    const text = dom.createElement('div', {
      className: 'ag-progress-text',
    });
    this.element.appendChild(text);
  }

  private updateProgress(): void {
    const percent = Math.min(100, Math.max(0, this.options.percent || 0));
    const percentString = `${percent}%`;

    if (this.options.type === 'line') {
      if (this.indicatorElement) {
        this.indicatorElement.style.width = percentString;
      }
      
      if (this.successElement) {
        this.successElement.style.width = percentString;
      }
      
      this.element.style.setProperty('--ag-progress-percent', percentString);
      
      // Add active class if status is active
      if (this.options.status === 'active') {
        this.element.classList.add('ag-progress--active');
      }
      
      // Update text if format provided
      if (this.options.format) {
        const text = this.element.querySelector('.ag-progress-text');
        if (text) {
          text.textContent = this.options.format(percent);
        }
      }
    } else {
      if (this.element) {
        const track = this.element.querySelector('.ag-progress-circle-track');
        const success = this.element.querySelector('.ag-progress-circle-success');
        
        if (track) {
          const offset = 251.2 - (251.2 * percent) / 100;
          track.style.strokeDashoffset = String(offset);
        }
        
        if (success) {
          success.style.strokeDashoffset = '0';
        }
        
        // Add active class if status is active
        if (this.options.status === 'active') {
          this.element.classList.add('ag-progress--active');
        }
        
        // Update text if format provided
        if (this.options.format) {
          const text = this.element.querySelector('.ag-progress-text');
          if (text) {
            text.textContent = this.options.format(percent);
          }
        }
      }
    }
  }

  private updateClasses(): void {
    const classes = progressClasses({
      size: this.options.size,
      variant: this.options.variant,
      type: this.options.type,
      status: this.options.status,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set percent
   */
  setPercent(percent: number): void {
    this.options.percent = percent;
    this.updateProgress();
  }

  /**
   * Set status
   */
  setStatus(status: 'normal' | 'active' | 'success' | 'exception'): void {
    this.options.status = status;
    this.updateClasses();
    this.updateProgress();
  }

  /**
   * Set type
   */
  setType(type: 'line' | 'circle' | 'dashboard'): void {
    this.options.type = type;
    this.updateClasses();
    // Re-create progress on type change
    this.destroy();
    this.init();
  }

  /**
   * Get percent
   */
  getPercent(): number {
    return this.options.percent || 0;
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
      this.trackElement = null;
    }
    if (this.successElement) {
      this.successElement.remove();
      this.successElement = null;
    }
    if (this.indicatorElement) {
      this.indicatorElement.remove();
      this.indicatorElement = null;
    }
  }
}

/**
 * Create progress from scratch
 */
export function createProgress(options: ProgressOptions = {}): Progress {
  const container = dom.createElement('div', {
    className: 'ag-progress',
  });

  const instance = new Progress(container, options);
  return instance;
}
