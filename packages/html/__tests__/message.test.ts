import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Message, showMessage, message } from '../src/components/message';

describe('Message Component', () => {
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
    // Clean up message containers
    const messageContainers = document.querySelectorAll('.ag-message-container');
    messageContainers.forEach(el => el.remove());
  });

  describe('constructor', () => {
    it('should create message with string content', () => {
      const msg = new Message('Test message');
      expect(msg.getElement().textContent).toContain('Test message');
    });

    it('should create message with HTML element', () => {
      const div = document.createElement('div');
      div.textContent = 'HTML content';
      const msg = new Message(div);
      expect(msg.getElement().contains(div)).toBe(true);
    });

    it('should apply type class', () => {
      const msg = new Message('Test', { type: 'success' });
      expect(msg.getElement().className).toContain('ag-message--success');
    });

    it('should apply closeable button', () => {
      const msg = new Message('Test', { closeable: true });
      const closeBtn = msg.getElement().querySelector('.ag-message__close');
      expect(closeBtn).toBeDefined();
    });

    it('should not show close button when closeable is false', () => {
      const msg = new Message('Test', { closeable: false });
      const closeBtn = msg.getElement().querySelector('.ag-message__close');
      expect(closeBtn).toBeNull();
    });
  });

  describe('show', () => {
    it('should append to message container', () => {
      const msg = new Message('Test message');
      msg.show();

      const container = document.querySelector('.ag-message-container');
      expect(container?.contains(msg.getElement())).toBe(true);

      msg.destroy();
    });

    it('should auto-close after duration', () => {
      const msg = new Message('Test', { duration: 3000 });
      msg.show();

      expect(msg.getElement().parentElement).toBeDefined();

      vi.advanceTimersByTime(3000);

      expect(msg.getElement().parentElement).toBeNull();
    });

    it('should not auto-close when duration is 0', () => {
      const msg = new Message('Test', { duration: 0 });
      msg.show();

      vi.advanceTimersByTime(5000);

      expect(msg.getElement().parentElement).toBeDefined();

      msg.destroy();
    });

    it('should not auto-close when duration is not specified', () => {
      const msg = new Message('Test');
      msg.show();

      vi.advanceTimersByTime(5000);

      expect(msg.getElement().parentElement).toBeDefined();

      msg.destroy();
    });
  });

  describe('close', () => {
    it('should remove message from DOM', () => {
      const msg = new Message('Test');
      msg.show();

      expect(msg.getElement().parentElement).toBeDefined();

      msg.close();

      expect(msg.getElement().parentElement).toBeNull();
    });

    it('should clear auto-close timer', () => {
      const msg = new Message('Test', { duration: 3000 });
      msg.show();

      msg.close();

      // No error should occur
      vi.advanceTimersByTime(3000);
    });

    it('should be callable from close button', () => {
      const msg = new Message('Test', { closeable: true });
      msg.show();

      const closeBtn = msg.getElement().querySelector('.ag-message__close') as HTMLButtonElement;
      closeBtn.click();

      expect(msg.getElement().parentElement).toBeNull();
    });
  });

  describe('showMessage', () => {
    it('should create and show message', () => {
      const msg = showMessage('Test');

      const container = document.querySelector('.ag-message-container');
      // Message should be appended to container
      expect(msg.getElement()).toBeDefined();
      expect(msg.getElement().textContent).toContain('Test');

      msg.destroy();
    });

    it('should auto-close by default after 3 seconds', () => {
      const msg = showMessage('Test');

      expect(msg.getElement().parentElement).toBeDefined();

      vi.advanceTimersByTime(3000);

      expect(msg.getElement().parentElement).toBeNull();
    });

    it('should support custom duration', () => {
      const msg = showMessage('Test', { duration: 1000 });

      vi.advanceTimersByTime(1000);

      expect(msg.getElement().parentElement).toBeNull();
    });
  });

  describe('message shortcuts', () => {
    it('should show success message', () => {
      const msg = message.success('Success!');

      expect(msg.getElement().className).toContain('ag-message--success');

      msg.destroy();
    });

    it('should show error message', () => {
      const msg = message.error('Error!');

      expect(msg.getElement().className).toContain('ag-message--danger');

      msg.destroy();
    });

    it('should show warning message', () => {
      const msg = message.warning('Warning!');

      expect(msg.getElement().className).toContain('ag-message--warning');

      msg.destroy();
    });

    it('should show info message', () => {
      const msg = message.info('Info!');

      expect(msg.getElement().className).toContain('ag-message--info');

      msg.destroy();
    });

    it('should support custom duration in shortcuts', () => {
      const msg = message.success('Test', 1000);

      vi.advanceTimersByTime(1000);

      expect(msg.getElement().parentElement).toBeNull();
    });
  });

  describe('types', () => {
    it('should support success type', () => {
      const msg = new Message('Test', { type: 'success' });
      expect(msg.getElement().className).toContain('success');
    });

    it('should support danger type', () => {
      const msg = new Message('Test', { type: 'danger' });
      expect(msg.getElement().className).toContain('danger');
    });

    it('should support warning type', () => {
      const msg = new Message('Test', { type: 'warning' });
      expect(msg.getElement().className).toContain('warning');
    });

    it('should support info type', () => {
      const msg = new Message('Test', { type: 'info' });
      expect(msg.getElement().className).toContain('info');
    });
  });
});
