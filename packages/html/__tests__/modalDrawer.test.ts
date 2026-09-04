import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Modal, Drawer, showModal, showDrawer } from '../src/components/overlay';

describe('Modal Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
    // Clean up modal elements
    const modals = document.querySelectorAll('.ag-modal, .ag-modal-mask');
    modals.forEach(el => el.remove());
  });

  describe('constructor', () => {
    it('should create modal with title', () => {
      const modal = new Modal({ title: 'Test Modal' });
      expect(modal).toBeDefined();
    });

    it('should create modal with content string', () => {
      const modal = new Modal({ title: 'Test', content: 'Hello' });
      expect(modal).toBeDefined();
    });

    it('should create modal with content HTMLElement', () => {
      const content = document.createElement('div');
      content.textContent = 'HTML content';
      const modal = new Modal({ title: 'Test', content: content });
      expect(modal).toBeDefined();
    });

    it('should create modal with footer string', () => {
      const modal = new Modal({ title: 'Test', footer: 'Footer' });
      expect(modal).toBeDefined();
    });

    it('should create modal with onOk and onCancel callbacks', () => {
      const onOk = vi.fn();
      const onCancel = vi.fn();
      const modal = new Modal({ title: 'Test', onOk, onCancel });
      expect(modal).toBeDefined();
    });
  });

  describe('show', () => {
    it('should append mask and modal to body', () => {
      const modal = new Modal({ title: 'Test' });
      modal.show();

      expect(document.body.querySelector('.ag-modal-mask')).toBeDefined();
      expect(document.body.querySelector('.ag-modal')).toBeDefined();
    });

    it('should center modal by default', () => {
      const modal = new Modal({ title: 'Test' });
      modal.show();

      const modalEl = document.body.querySelector('.ag-modal');
      expect(modalEl?.className).toContain('ag-modal--centered');
    });

    it('should not center modal when centered is false', () => {
      const modal = new Modal({ title: 'Test', centered: false });
      modal.show();

      const modalEl = document.body.querySelector('.ag-modal');
      expect(modalEl?.className).not.toContain('ag-modal--centered');
    });
  });

  describe('close', () => {
    it('should remove mask and modal from DOM', () => {
      const modal = new Modal({ title: 'Test' });
      modal.show();

      expect(document.body.querySelector('.ag-modal')).toBeDefined();

      modal.close();

      expect(document.body.querySelector('.ag-modal')).toBeNull();
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const modal = new Modal({ title: 'Test', onClose });
      modal.show();
      modal.close();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('maskClosable', () => {
    it('should close when mask is clicked by default', () => {
      const onClose = vi.fn();
      const modal = new Modal({ title: 'Test', onClose, maskClosable: true });
      modal.show();

      const mask = document.body.querySelector('.ag-modal-mask') as HTMLElement;
      mask.click();

      expect(onClose).toHaveBeenCalled();
    });

    it('should not close when maskClosable is false', () => {
      const onClose = vi.fn();
      const modal = new Modal({ title: 'Test', onClose, maskClosable: false });
      modal.show();

      const mask = document.body.querySelector('.ag-modal-mask') as HTMLElement;
      mask.click();

      expect(document.body.querySelector('.ag-modal')).toBeDefined();
    });
  });

  describe('destroy', () => {
    it('should remove mask and modal', () => {
      const modal = new Modal({ title: 'Test' });
      modal.show();
      modal.destroy();

      expect(document.body.querySelector('.ag-modal')).toBeNull();
    });
  });

  describe('showModal factory', () => {
    it('should create and show modal', () => {
      const modal = showModal({ title: 'Test' });

      expect(document.body.querySelector('.ag-modal')).toBeDefined();
      expect(document.body.querySelector('.ag-modal-mask')).toBeDefined();
    });
  });
});

describe('Drawer Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
    // Clean up drawer elements
    const drawers = document.querySelectorAll('.ag-drawer, .ag-drawer-mask');
    drawers.forEach(el => el.remove());
  });

  describe('constructor', () => {
    it('should create drawer with title', () => {
      const drawer = new Drawer({ title: 'Test Drawer' });
      expect(drawer).toBeDefined();
    });

    it('should create drawer with content', () => {
      const drawer = new Drawer({ title: 'Test', content: 'Hello' });
      expect(drawer).toBeDefined();
    });
  });

  describe('show', () => {
    it('should append mask and drawer to body', () => {
      const drawer = new Drawer({ title: 'Test' });
      drawer.show();

      expect(document.body.querySelector('.ag-drawer-mask')).toBeDefined();
      expect(document.body.querySelector('.ag-drawer')).toBeDefined();

      drawer.destroy();
    });

    it('should place drawer on right by default', () => {
      const drawer = new Drawer({ title: 'Test' });
      drawer.show();

      const drawerEl = document.body.querySelector('.ag-drawer');
      expect(drawerEl?.className).toContain('ag-drawer--right');

      drawer.destroy();
    });

    it('should support different placements', () => {
      ['left', 'right', 'top', 'bottom'].forEach((placement) => {
        const drawer = new Drawer({ title: 'Test', placement: placement as any });
        drawer.show();

        const drawerEl = document.body.querySelector(`.ag-drawer.ag-drawer--${placement}`);
        expect(drawerEl).toBeDefined();

        drawer.destroy();
      });
    });

    it('should destroy component', () => {
      const drawer = new Drawer({ title: 'Test' });
      drawer.show();
      drawer.destroy();

      expect(document.body.querySelector('.ag-drawer')).toBeNull();
    });
  });

  describe('close', () => {
    it('should remove mask and drawer from DOM', () => {
      const drawer = new Drawer({ title: 'Test' });
      drawer.show();
      drawer.close();

      expect(document.body.querySelector('.ag-drawer')).toBeNull();
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const drawer = new Drawer({ title: 'Test', onClose });
      drawer.show();
      drawer.close();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove mask and drawer', () => {
      const drawer = new Drawer({ title: 'Test' });
      drawer.show();
      drawer.destroy();

      expect(document.body.querySelector('.ag-drawer')).toBeNull();
    });
  });

  describe('showDrawer factory', () => {
    it('should create and show drawer', () => {
      const drawer = showDrawer({ title: 'Test' });

      expect(document.body.querySelector('.ag-drawer')).toBeDefined();
      expect(document.body.querySelector('.ag-drawer-mask')).toBeDefined();
    });
  });
});
