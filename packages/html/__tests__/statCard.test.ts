import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StatCard, createStatCard } from '../src/components/stat-card';

describe('StatCard Component', () => {
  let container: HTMLDivElement;
  let cardEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    cardEl = document.createElement('div');
    container.appendChild(cardEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const card = new StatCard(cardEl);
      expect(card.getElement()).toBe(cardEl);
    });

    it('should initialize with selector', () => {
      cardEl.id = 'test-card';
      const card = new StatCard('#test-card');
      expect(card.getElement()).toBe(cardEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new StatCard('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render icon and title in header', () => {
      new StatCard(cardEl, { icon: '★', title: 'Revenue' });
      const header = cardEl.querySelector('.ag-stat-card-header');
      expect(header?.querySelector('.ag-stat-card-icon')?.textContent).toBe('★');
      expect(header?.querySelector('.ag-stat-card-title')?.textContent).toBe('Revenue');
    });

    it('should not render icon/title elements when omitted', () => {
      new StatCard(cardEl, { value: 100 });
      expect(cardEl.querySelector('.ag-stat-card-icon')).toBeNull();
      expect(cardEl.querySelector('.ag-stat-card-title')).toBeNull();
    });

    it('should render value and description in body', () => {
      new StatCard(cardEl, { value: 1234, description: 'This month' });
      expect(cardEl.querySelector('.ag-stat-card-value')?.textContent).toBe('1234');
      expect(cardEl.querySelector('.ag-stat-card-description')?.textContent).toBe('This month');
    });

    it('should not render value element when value is undefined', () => {
      new StatCard(cardEl, { description: 'No value here' });
      expect(cardEl.querySelector('.ag-stat-card-value')).toBeNull();
    });

    it('should render numeric zero value (falsy but defined)', () => {
      new StatCard(cardEl, { value: 0 });
      expect(cardEl.querySelector('.ag-stat-card-value')?.textContent).toBe('0');
    });

    it('should render trend footer with up arrow and trend text', () => {
      new StatCard(cardEl, { trend: 'up', trendText: '+12%' });
      const footer = cardEl.querySelector('.ag-stat-card-footer');
      const trend = footer?.querySelector('.ag-stat-card-trend');
      expect(trend?.className).toContain('ag-stat-card-trend--up');
      expect(trend?.textContent).toBe('\u2191');
      expect(footer?.querySelector('.ag-stat-card-trend-text')?.textContent).toBe('+12%');
    });

    it('should render down trend arrow', () => {
      new StatCard(cardEl, { trend: 'down' });
      expect(cardEl.querySelector('.ag-stat-card-trend')?.textContent).toBe('\u2193');
    });

    it('should render neutral trend arrow', () => {
      new StatCard(cardEl, { trend: 'neutral' });
      expect(cardEl.querySelector('.ag-stat-card-trend')?.textContent).toBe('\u2192');
    });

    it('should not render footer when neither trend nor trendText provided', () => {
      new StatCard(cardEl, { value: 5 });
      expect(cardEl.querySelector('.ag-stat-card-footer')).toBeNull();
    });

    it('should render footer with only trendText (no trend icon)', () => {
      new StatCard(cardEl, { trendText: 'stable' });
      const footer = cardEl.querySelector('.ag-stat-card-footer');
      expect(footer).not.toBeNull();
      expect(footer?.querySelector('.ag-stat-card-trend')).toBeNull();
      expect(footer?.querySelector('.ag-stat-card-trend-text')?.textContent).toBe('stable');
    });
  });

  describe('setValue', () => {
    it('should update the rendered value', () => {
      const card = new StatCard(cardEl, { value: 1 });
      card.setValue(42);
      expect(cardEl.querySelector('.ag-stat-card-value')?.textContent).toBe('42');
    });

    it('should not create a value element if none existed initially', () => {
      const card = new StatCard(cardEl);
      card.setValue(99);
      expect(cardEl.querySelector('.ag-stat-card-value')).toBeNull();
    });
  });

  describe('setTrend', () => {
    it('should update trend class and arrow when trend element existed', () => {
      const card = new StatCard(cardEl, { trend: 'up' });
      card.setTrend('down');
      const trend = cardEl.querySelector('.ag-stat-card-trend');
      expect(trend?.className).toContain('ag-stat-card-trend--down');
      expect(trend?.className).not.toContain('ag-stat-card-trend--up');
      expect(trend?.textContent).toBe('\u2193');
    });

    it('should not create a trend element if none existed initially', () => {
      const card = new StatCard(cardEl);
      card.setTrend('up');
      expect(cardEl.querySelector('.ag-stat-card-trend')).toBeNull();
    });
  });

  describe('setTitle', () => {
    it('should update the rendered title', () => {
      const card = new StatCard(cardEl, { title: 'Old' });
      card.setTitle('New');
      expect(cardEl.querySelector('.ag-stat-card-title')?.textContent).toBe('New');
    });

    it('should not create a title element if none existed initially', () => {
      const card = new StatCard(cardEl);
      card.setTitle('Too Late');
      expect(cardEl.querySelector('.ag-stat-card-title')).toBeNull();
    });
  });

  describe('createStatCard', () => {
    it('should create a stat card from scratch with rendered options', () => {
      const card = createStatCard({ title: 'Users', value: 500, trend: 'up' });
      const el = card.getElement();
      expect(el.className).toContain('ag-stat-card');
      expect(el.querySelector('.ag-stat-card-title')?.textContent).toBe('Users');
      expect(el.querySelector('.ag-stat-card-value')?.textContent).toBe('500');
      expect(el.querySelector('.ag-stat-card-trend')?.className).toContain('ag-stat-card-trend--up');
    });
  });

  describe('destroy', () => {
    it('should remove the trend element from the DOM when it existed', () => {
      const card = new StatCard(cardEl, { trend: 'up' });
      expect(cardEl.querySelector('.ag-stat-card-trend')).not.toBeNull();
      card.destroy();
      expect(cardEl.querySelector('.ag-stat-card-trend')).toBeNull();
    });

    it('should not throw when destroying an instance without a trend', () => {
      const card = new StatCard(cardEl, { value: 1 });
      expect(() => card.destroy()).not.toThrow();
    });
  });
});
