/**
 * Tooltip component
 */

import { ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { tooltipClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface TooltipOptions {
  title?: string;
  variant?: ComponentVariant;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  className?: string;
  onVisibleChange?: (visible: boolean) => void;
}

export class Tooltip {
  private target: HTMLElement;
  private element: HTMLDivElement;
  private title: string;
  private options: TooltipOptions;
  private visible: boolean = false;
  private eventManager = new EventManager();

  constructor(
    target: HTMLElement | string,
    options: TooltipOptions = {}
  ) {
    this.target = dom.getElement<HTMLElement>(target);
    this.title = options.title || '';
    this.options = {
      variant: 'info',
      position: 'top',
      trigger: 'hover',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createTooltipElement();
    this.updateClasses();
    this.bindEvents();
  }

  private createTooltipElement(): void {
    const tooltip = dom.createElement('div', {
      className: 'ag-tooltip-inner',
      textContent: this.title,
    });
    
    this.element = dom.createElement('div', {
      className: 'ag-tooltip',
      attributes: {
        role: 'tooltip',
        id: `tooltip-${this.generateId()}`,
      },
    });
    this.element.appendChild(tooltip);
    
    // Position arrow
    const arrow = dom.createElement('div', {
      className: 'ag-tooltip-arrow',
    });
    this.element.appendChild(arrow);
    
    document.body.appendChild(this.element);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private updateClasses(): void {
    const classes = tooltipClasses({
      variant: this.options.variant,
      position: this.options.position,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    if (this.options.disabled) return;

    if (this.options.trigger === 'hover') {
      this.eventManager.on(this.target, 'mouseenter', () => this.show());
      this.eventManager.on(this.target, 'mouseleave', () => this.hide());
    } else if (this.options.trigger === 'click') {
      this.eventManager.on(this.target, 'click', () => this.toggle());
    } else if (this.options.trigger === 'focus') {
      this.eventManager.on(this.target, 'focus', () => this.show());
      this.eventManager.on(this.target, 'blur', () => this.hide());
    }

    // Hide on document click
    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (this.visible && e.target !== this.target && !this.element.contains(e.target as Node)) {
        this.hide();
      }
    });
  }

  /**
   * Show tooltip
   */
  show(): void {
    if (this.visible || this.options.disabled) return;
    
    this.visible = true;
    this.element.style.display = 'block';
    this.position();
    
    if (this.options.onVisibleChange) {
      this.options.onVisibleChange(true);
    }
  }

  /**
   * Hide tooltip
   */
  hide(): void {
    if (!this.visible) return;
    
    this.visible = false;
    this.element.style.display = 'none';
    
    if (this.options.onVisibleChange) {
      this.options.onVisibleChange(false);
    }
  }

  /**
   * Toggle tooltip visibility
   */
  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Position tooltip relative to target
   */
  private position(): void {
    const targetRect = this.target.getBoundingClientRect();
    const tooltipRect = this.element.getBoundingClientRect();
    const arrow = this.element.querySelector('.ag-tooltip-arrow');
    
    let top = 0;
    let left = 0;
    let positionClass = '';

    const gap = 8;

    switch (this.options.position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - gap;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        positionClass = 'ag-tooltip--top';
        if (arrow) arrow.className = 'ag-tooltip-arrow ag-tooltip-arrow--bottom';
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        positionClass = 'ag-tooltip--bottom';
        if (arrow) arrow.className = 'ag-tooltip-arrow ag-tooltip-arrow--top';
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - gap;
        positionClass = 'ag-tooltip--left';
        if (arrow) arrow.className = 'ag-tooltip-arrow ag-tooltip-arrow--right';
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + gap;
        positionClass = 'ag-tooltip--right';
        if (arrow) arrow.className = 'ag-tooltip-arrow ag-tooltip-arrow--left';
        break;
    }

    // Boundary checks to keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = gap;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - gap;
    }
    if (top < 0) top = gap;
    if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - gap;
    }

    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
    
    this.element.className = tooltipClasses({
      variant: this.options.variant,
      position: this.options.position,
      className: this.options.className,
    });
  }

  /**
   * Update tooltip title
   */
  setTitle(title: string): void {
    this.title = title;
    const inner = this.element.querySelector('.ag-tooltip-inner');
    if (inner) {
      inner.textContent = title;
    }
    
    if (this.visible) {
      this.position();
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    if (disabled) {
      this.hide();
    }
  }

  /**
   * Check if disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Get tooltip element
   */
  getTooltipElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get target element
   */
  getTarget(): HTMLElement {
    return this.target;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Create tooltip from scratch
 */
export function createTooltip(options: TooltipOptions): Tooltip {
  // For tooltip, target is required
  throw new Error('Tooltip requires a target element');
}
