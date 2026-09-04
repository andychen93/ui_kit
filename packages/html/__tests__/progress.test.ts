import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Progress, createProgress } from '../src/components/progress';

describe('Progress Component', () => {
  let container: HTMLDivElement;
  let rootEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    rootEl = document.createElement('div');
    container.appendChild(rootEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const progress = new Progress(rootEl);
      expect(progress.getElement()).toBe(rootEl);
    });

    it('should initialize with selector string', () => {
      rootEl.id = 'test-progress';
      const progress = new Progress('#test-progress');
      expect(progress.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new Progress('#missing-progress')).toThrow(
        'Element not found for selector: #missing-progress'
      );
    });
  });

  describe('initial render - line type', () => {
    it('should default to line type and build track/success/indicator elements', () => {
      const progress = new Progress(rootEl);
      expect(rootEl.className).toContain('ag-progress');
      expect(rootEl.className).toContain('ag-progress--line');

      const track = rootEl.querySelector('.ag-progress-track');
      const success = rootEl.querySelector('.ag-progress-success') as HTMLElement;
      const indicator = rootEl.querySelector('.ag-progress-indicator') as HTMLElement;
      expect(track).not.toBeNull();
      expect(success).not.toBeNull();
      expect(indicator).not.toBeNull();
    });

    it('should reflect the initial percent option in indicator/success widths', () => {
      const progress = new Progress(rootEl, { percent: 42 });
      const indicator = rootEl.querySelector('.ag-progress-indicator') as HTMLElement;
      const success = rootEl.querySelector('.ag-progress-success') as HTMLElement;
      expect(indicator.style.width).toBe('42%');
      expect(success.style.width).toBe('42%');
      expect(rootEl.style.getPropertyValue('--ag-progress-percent')).toBe('42%');
    });

    it('should render formatted text when a format function is provided', () => {
      const progress = new Progress(rootEl, {
        percent: 30,
        format: (p) => `${p} out of 100`,
      });
      const text = rootEl.querySelector('.ag-progress-text');
      expect(text?.textContent).toBe('30 out of 100');
    });

    it('should not render a text element when no format function is provided', () => {
      const progress = new Progress(rootEl, { percent: 10 });
      expect(rootEl.querySelector('.ag-progress-text')).toBeNull();
    });

    it('should add the active status class when status is active', () => {
      const progress = new Progress(rootEl, { status: 'active' });
      expect(rootEl.classList.contains('ag-progress--active')).toBe(true);
    });
  });

  describe('initial render - circle type', () => {
    it('should build an svg with background/track/success circles', () => {
      const progress = new Progress(rootEl, { type: 'circle' });
      expect(rootEl.className).toContain('ag-progress--circle');

      const svg = rootEl.querySelector('svg.ag-progress-circle');
      const bg = rootEl.querySelector('.ag-progress-circle-bg');
      const track = rootEl.querySelector('.ag-progress-circle-track');
      const success = rootEl.querySelector('.ag-progress-circle-success');
      expect(svg).not.toBeNull();
      expect(bg).not.toBeNull();
      expect(track).not.toBeNull();
      expect(success).not.toBeNull();
    });

    it('should compute strokeDashoffset on the track circle from the percent', () => {
      const progress = new Progress(rootEl, { type: 'circle', percent: 50 });
      const track = rootEl.querySelector('.ag-progress-circle-track') as SVGElement;
      // 251.2 - (251.2 * 50) / 100 = 125.6
      expect(track.style.strokeDashoffset).toBe('125.6');
    });

    it('should set the success circle offset to 0', () => {
      const progress = new Progress(rootEl, { type: 'circle', percent: 50 });
      const success = rootEl.querySelector('.ag-progress-circle-success') as SVGElement;
      expect(success.style.strokeDashoffset).toBe('0');
    });

    it('should render formatted text for circle type as well', () => {
      const progress = new Progress(rootEl, {
        type: 'circle',
        percent: 75,
        format: (p) => `${p}%!`,
      });
      const text = rootEl.querySelector('.ag-progress-text');
      expect(text?.textContent).toBe('75%!');
    });
  });

  describe('setPercent', () => {
    it('should clamp above 100 down to 100', () => {
      const progress = new Progress(rootEl);
      progress.setPercent(150);
      expect(progress.getPercent()).toBe(150); // stored raw value from options
      const indicator = rootEl.querySelector('.ag-progress-indicator') as HTMLElement;
      expect(indicator.style.width).toBe('100%');
    });

    it('should clamp below 0 up to 0', () => {
      const progress = new Progress(rootEl);
      progress.setPercent(-20);
      const indicator = rootEl.querySelector('.ag-progress-indicator') as HTMLElement;
      expect(indicator.style.width).toBe('0%');
    });

    it('should update the circle track offset when percent changes', () => {
      const progress = new Progress(rootEl, { type: 'circle' });
      progress.setPercent(100);
      const track = rootEl.querySelector('.ag-progress-circle-track') as SVGElement;
      expect(track.style.strokeDashoffset).toBe('0');
    });

    it('should update formatted text on percent change', () => {
      const progress = new Progress(rootEl, {
        percent: 0,
        format: (p) => `${p}pct`,
      });
      progress.setPercent(65);
      const text = rootEl.querySelector('.ag-progress-text');
      expect(text?.textContent).toBe('65pct');
    });
  });

  describe('setStatus', () => {
    it('should update the status class', () => {
      const progress = new Progress(rootEl, { status: 'normal' });
      expect(rootEl.className).toContain('ag-progress--normal');
      progress.setStatus('exception');
      expect(rootEl.className).toContain('ag-progress--exception');
      expect(rootEl.className).not.toContain('ag-progress--normal');
    });

    it('should add the active class when switched to active', () => {
      const progress = new Progress(rootEl, { status: 'normal' });
      expect(rootEl.classList.contains('ag-progress--active')).toBe(false);
      progress.setStatus('active');
      expect(rootEl.classList.contains('ag-progress--active')).toBe(true);
    });
  });

  describe('setType', () => {
    it('should switch from line to circle rendering, replacing the DOM structure', () => {
      const progress = new Progress(rootEl, { type: 'line', percent: 40 });
      expect(rootEl.querySelector('.ag-progress-track')).not.toBeNull();

      progress.setType('circle');

      expect(rootEl.className).toContain('ag-progress--circle');
      expect(rootEl.querySelector('svg.ag-progress-circle')).not.toBeNull();
      const track = rootEl.querySelector('.ag-progress-circle-track') as SVGElement;
      // percent carried over (40): 251.2 - 251.2*40/100 = 150.72 (subject to fp rounding)
      expect(parseFloat(track.style.strokeDashoffset)).toBeCloseTo(150.72, 5);
    });
  });

  describe('getPercent', () => {
    it('should return 0 by default', () => {
      const progress = new Progress(rootEl);
      expect(progress.getPercent()).toBe(0);
    });

    it('should return the last set percent', () => {
      const progress = new Progress(rootEl);
      progress.setPercent(77);
      expect(progress.getPercent()).toBe(77);
    });
  });

  describe('destroy', () => {
    it('should remove the track/success/indicator elements for line type', () => {
      const progress = new Progress(rootEl, { percent: 20 });
      expect(rootEl.querySelector('.ag-progress-track')).not.toBeNull();

      progress.destroy();

      expect(rootEl.querySelector('.ag-progress-track')).toBeNull();
      expect(rootEl.querySelector('.ag-progress-success')).toBeNull();
      expect(rootEl.querySelector('.ag-progress-indicator')).toBeNull();
    });
  });

  describe('createProgress', () => {
    it('should create a progress element from scratch reflecting options', () => {
      const progress = createProgress({ percent: 55, type: 'line' });
      const indicator = progress.getElement().querySelector('.ag-progress-indicator') as HTMLElement;
      expect(progress.getElement().className).toContain('ag-progress');
      expect(indicator.style.width).toBe('55%');
    });
  });
});
