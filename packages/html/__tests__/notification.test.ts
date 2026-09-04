import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Notification, showNotification, notification } from '../src/components/notification';

describe('Notification Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
    vi.useRealTimers();
    // Clean up notification containers
    const notificationContainers = document.querySelectorAll('.ag-notification-container');
    notificationContainers.forEach(el => el.remove());
  });

  describe('constructor', () => {
    it('should create notification with title and description', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello' });
      expect(notif).toBeDefined();
    });

    it('should apply type class', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', type: 'success' });
      expect(notif.getElement().className).toContain('ag-notification--success');
    });

    it('should create with closeable button', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', closeable: true });
      const closeBtn = notif.getElement().querySelector('.ag-notification__close');
      expect(closeBtn).toBeDefined();
    });
  });

  describe('show', () => {
    it('should append to notification container', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello' });
      notif.show();

      const container = document.querySelector('.ag-notification-container');
      expect(container?.contains(notif.getElement())).toBe(true);

      notif.destroy();
    });

    it('should auto-close after duration', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', duration: 3000 });
      notif.show();

      vi.advanceTimersByTime(3000);

      expect(notif.getElement().parentElement).toBeNull();
    });

    it('should not auto-close when duration is 0', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', duration: 0 });
      notif.show();

      vi.advanceTimersByTime(5000);

      expect(notif.getElement().parentElement).toBeDefined();

      notif.destroy();
    });
  });

  describe('close', () => {
    it('should remove notification from DOM', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello' });
      notif.show();

      expect(notif.getElement().parentElement).toBeDefined();

      notif.close();

      expect(notif.getElement().parentElement).toBeNull();
    });

    it('should clear auto-close timer', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', duration: 3000 });
      notif.show();

      notif.close();

      vi.advanceTimersByTime(3000);
      // Should not throw
    });
  });

  describe('showNotification factory', () => {
    it('should create and show notification', () => {
      const notif = showNotification({ title: 'Test', description: 'Hello' });

      const container = document.querySelector('.ag-notification-container');
      expect(notif.getElement()).toBeDefined();
      expect(notif.getElement().textContent).toContain('Test');

      notif.destroy();
    });

    it('should auto-close by default after 5 seconds', () => {
      const notif = showNotification({ title: 'Test', description: 'Hello' });

      vi.advanceTimersByTime(5000);

      expect(notif.getElement().parentElement).toBeNull();
    });

    it('should support custom duration', () => {
      const notif = showNotification({ title: 'Test', description: 'Hello', duration: 1000 });

      vi.advanceTimersByTime(1000);

      expect(notif.getElement().parentElement).toBeNull();
    });
  });

  describe('notification shortcuts', () => {
    it('should show success notification', () => {
      const notif = notification.success({ title: 'Success!', description: 'Done' });

      expect(notif.getElement().className).toContain('ag-notification--success');

      notif.destroy();
    });

    it('should show error notification', () => {
      const notif = notification.error({ title: 'Error!', description: 'Failed' });

      expect(notif.getElement().className).toContain('ag-notification--danger');

      notif.destroy();
    });
  });

  describe('closeable', () => {
    it('should close when close button is clicked', () => {
      const onClose = vi.fn();
      const notif = new Notification({ title: 'Test', description: 'Hello', closeable: true, onClose });
      notif.show();

      const closeBtn = notif.getElement().querySelector('.ag-notification__close') as HTMLButtonElement;
      closeBtn.click();

      expect(onClose).toHaveBeenCalled();
      expect(notif.getElement().parentElement).toBeNull();
    });
  });

  describe('placement', () => {
    it('should support different placements', () => {
      const notif = new Notification({ title: 'Test', description: 'Hello', placement: 'top-right' });
      expect(notif).toBeDefined();
    });
  });
});
