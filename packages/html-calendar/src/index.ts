/**
 * Argon UI Kit - HTML Calendar Plugin (FullCalendar wrapper)
 */

import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export interface ArgonCalendarOptions extends Partial<CalendarOptions> {
  events?: any[];
}

export class ArgonCalendar {
  private calendar: Calendar;
  private container: HTMLElement;

  constructor(container: HTMLElement | string, options: ArgonCalendarOptions = {}) {
    if (typeof container === 'string') {
      const element = document.querySelector<HTMLElement>(container);
      if (!element) {
        throw new Error(`Calendar container not found for selector: ${container}`);
      }
      this.container = element;
    } else {
      this.container = container;
    }

    this.calendar = new Calendar(this.container, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      ...options
    });

    this.calendar.render();
  }

  /**
   * Get calendar instance
   */
  getCalendar(): Calendar {
    return this.calendar;
  }

  /**
   * Add event
   */
  addEvent(event: any): void {
    this.calendar.addEvent(event);
  }

  /**
   * Remove event
   */
  removeEvent(eventId: string): void {
    const event = this.calendar.getEventById(eventId);
    if (event) event.remove();
  }

  /**
   * Get events
   */
  getEvents(): any[] {
    return this.calendar.getEvents();
  }

  /**
   * Destroy calendar
   */
  destroy(): void {
    this.calendar.destroy();
  }
}

export default ArgonCalendar;
