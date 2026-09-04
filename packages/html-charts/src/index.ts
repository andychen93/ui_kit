/**
 * Argon UI Kit - HTML Charts Plugin
 * Chart.js wrapper for @argon-kit/html
 */

import {
  Chart as ChartJS,
  ChartOptions,
  registerables
} from 'chart.js';

// Register all Chart.js components
ChartJS.register(...registerables);

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'scatter';
  data: any;
  options?: ChartOptions;
}

export class ArgonChart {
  private chart: ChartJS | null = null;
  private canvas: HTMLCanvasElement;
  private config: ChartConfig;

  constructor(canvas: HTMLCanvasElement | string, config: ChartConfig) {
    if (typeof canvas === 'string') {
      const element = document.querySelector<HTMLCanvasElement>(canvas);
      if (!element) {
        throw new Error(`Canvas element not found for selector: ${canvas}`);
      }
      this.canvas = element;
    } else {
      this.canvas = canvas;
    }
    this.config = config;
    this.init();
  }

  private init(): void {
    this.chart = new ChartJS(this.canvas, {
      type: this.config.type,
      data: this.config.data,
      options: this.config.options || {}
    });
  }

  /**
   * Get chart instance
   */
  getChart(): ChartJS {
    if (!this.chart) throw new Error('Chart not initialized');
    return this.chart;
  }

  /**
   * Update chart
   */
  update(): void {
    this.chart?.update();
  }

  /**
   * Destroy chart
   */
  destroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}

/**
 * Create line chart
 */
export function createLineChart(
  canvas: HTMLCanvasElement | string,
  data: any,
  options?: ChartOptions
): ArgonChart {
  return new ArgonChart(canvas, {
    type: 'line',
    data,
    options
  });
}

/**
 * Create bar chart
 */
export function createBarChart(
  canvas: HTMLCanvasElement | string,
  data: any,
  options?: ChartOptions
): ArgonChart {
  return new ArgonChart(canvas, {
    type: 'bar',
    data,
    options
  });
}

/**
 * Create pie chart
 */
export function createPieChart(
  canvas: HTMLCanvasElement | string,
  data: any,
  options?: ChartOptions
): ArgonChart {
  return new ArgonChart(canvas, {
    type: 'pie',
    data,
    options
  });
}

/**
 * Create doughnut chart
 */
export function createDoughnutChart(
  canvas: HTMLCanvasElement | string,
  data: any,
  options?: ChartOptions
): ArgonChart {
  return new ArgonChart(canvas, {
    type: 'doughnut',
    data,
    options
  });
}

export default ArgonChart;
