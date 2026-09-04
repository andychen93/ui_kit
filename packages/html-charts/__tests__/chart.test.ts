import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('chart.js', () => {
  const mockChartDestroy = vi.fn();
  const mockChartUpdate = vi.fn();
  const mockChartInit = vi.fn();

  const MockChart = class {
    constructor() {
      mockChartInit();
    }
    update() {
      mockChartUpdate();
    }
    destroy() {
      mockChartDestroy();
    }
  };
  MockChart.register = vi.fn();

  return {
    Chart: MockChart,
    registerables: []
  };
});

import { ArgonChart, createLineChart, createBarChart, createPieChart, createDoughnutChart } from '../src/index';

describe('HTML Charts Plugin', () => {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    canvas = document.createElement('canvas');
    canvas.id = 'test-chart';
    container.appendChild(canvas);
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.removeChild(container);
  });

  describe('module exports', () => {
    it('should export ArgonChart class', () => {
      expect(ArgonChart).toBeDefined();
    });

    it('should export createLineChart function', () => {
      expect(typeof createLineChart).toBe('function');
    });

    it('should export createBarChart function', () => {
      expect(typeof createBarChart).toBe('function');
    });

    it('should export createPieChart function', () => {
      expect(typeof createPieChart).toBe('function');
    });

    it('should export createDoughnutChart function', () => {
      expect(typeof createDoughnutChart).toBe('function');
    });
  });

  describe('ArgonChart constructor', () => {
    it('should accept canvas element', () => {
      const chart = new ArgonChart(canvas, {
        type: 'line',
        data: { labels: [], datasets: [] }
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });

    it('should accept canvas selector', () => {
      const chart = new ArgonChart('#test-chart', {
        type: 'line',
        data: { labels: [], datasets: [] }
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });

    it('should throw error if canvas selector not found', () => {
      expect(() => {
        new ArgonChart('#non-existent-canvas', {
          type: 'line',
          data: { labels: [], datasets: [] }
        });
      }).toThrow('Canvas element not found for selector: #non-existent-canvas');
    });
  });

  describe('ArgonChart API', () => {
    it('should get chart instance', () => {
      const chart = new ArgonChart(canvas, {
        type: 'line',
        data: { labels: [], datasets: [] }
      });

      const instance = chart.getChart();
      expect(instance).toBeDefined();
    });

    it('should update chart', () => {
      const chart = new ArgonChart(canvas, {
        type: 'line',
        data: { labels: [], datasets: [] }
      });

      chart.update();
    });

    it('should destroy chart', () => {
      const chart = new ArgonChart(canvas, {
        type: 'line',
        data: { labels: [], datasets: [] }
      });

      chart.destroy();
    });
  });

  describe('createLineChart', () => {
    it('should create line chart', () => {
      const chart = createLineChart(canvas, {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Test', data: [1, 2, 3] }]
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });

    it('should create line chart from selector', () => {
      const chart = createLineChart('#test-chart', {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Test', data: [1, 2, 3] }]
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });

    it('should throw error if selector not found', () => {
      expect(() => {
        createLineChart('#non-existent', {
          labels: [],
          datasets: []
        });
      }).toThrow('Canvas element not found for selector: #non-existent');
    });
  });

  describe('createBarChart', () => {
    it('should create bar chart', () => {
      const chart = createBarChart(canvas, {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Test', data: [1, 2, 3] }]
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });
  });

  describe('createPieChart', () => {
    it('should create pie chart', () => {
      const chart = createPieChart(canvas, {
        labels: ['Red', 'Blue'],
        datasets: [{ data: [50, 50] }]
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });
  });

  describe('createDoughnutChart', () => {
    it('should create doughnut chart', () => {
      const chart = createDoughnutChart(canvas, {
        labels: ['Small', 'Medium', 'Large'],
        datasets: [{ data: [25, 35, 40] }]
      });

      expect(chart).toBeInstanceOf(ArgonChart);
    });
  });
});
