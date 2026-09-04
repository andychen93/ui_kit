import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@fullcalendar/core', () => ({
  Calendar: vi.fn().mockImplementation(() => ({
    render: vi.fn(),
    destroy: vi.fn(),
    addEvent: vi.fn(),
    getEvents: vi.fn(() => []),
    getEventById: vi.fn(() => null),
  })),
}));

vi.mock('@fullcalendar/daygrid', () => ({}));
vi.mock('@fullcalendar/interaction', () => ({}));

// Mock the actual imports that the module uses
vi.mock('@fullcalendar/daygrid', () => ({
  default: {},
}));

vi.mock('@fullcalendar/interaction', () => ({
  default: {},
}));

import { ArgonCalendar } from '../src/index';

describe('HTML Calendar Plugin', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should accept HTMLElement', () => {
      const calendar = new ArgonCalendar(container);
      expect(calendar).toBeDefined();
    });

    it('should accept selector string', () => {
      container.id = 'calendar-container';
      const calendar = new ArgonCalendar('#calendar-container');
      expect(calendar).toBeDefined();
    });

    it('should throw error if selector not found', () => {
      expect(() => {
        new ArgonCalendar('#non-existent-calendar');
      }).toThrow('Calendar container not found for selector: #non-existent-calendar');
    });
  });

  describe('API', () => {
    it('should get calendar instance', () => {
      const calendar = new ArgonCalendar(container);
      const instance = calendar.getCalendar();
      expect(instance).toBeDefined();
    });

    it('should destroy calendar', () => {
      const calendar = new ArgonCalendar(container);
      calendar.destroy();
    });
  });
});
