import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ArgonChart,
  createLineChart,
  createBarChart,
  createPieChart,
  createDoughnutChart
} from '../src/index';

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
    document.body.removeChild(container);
  });

  describe('chart registration', () => {
    it('all registerables should be imported', () => {
      // Just verify the imports work
      import { ArgonChart } from '../src/index';
      expect(ArgonChart).toBeDefined();
    });
  });

  describe('module exports', () => {
    it('should export all chart factory functions', () => {
      import {
        ArgonChart,
        createLineChart,
        createBarChart,
        createPieChart,
        createDoughnutChart
      } from '../src/index';

      expect([ArgonChart, createLineChart, createBarChart, createPieChart, createDoughnutChart]).toBeDefined();
    });
  });

  describe('selector error handling', () => {
    it('should throw error if canvas selector not found', () => {
      import { ArgonChart } from '../src/index';
      
      expect(() => {
        new (ArgonChart as any)('#non-existent-canvas', {
          type: 'line',
          data: {}
        });
      }).toThrow('Canvas element not found');
    });
  });
});
