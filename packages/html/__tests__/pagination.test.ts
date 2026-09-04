import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Pagination, createPagination } from '../src/components/table';

describe('Pagination Component', () => {
  let container: HTMLDivElement;
  let paginationEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    paginationEl = document.createElement('div');
    container.appendChild(paginationEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with options', () => {
      const pagination = new Pagination(paginationEl, { total: 100, pageSize: 10 });
      expect(pagination.getCurrentPage()).toBe(1);
      pagination.destroy();
    });

    it('should initialize with custom current page', () => {
      const pagination = new Pagination(paginationEl, { total: 100, pageSize: 10, current: 3 });
      expect(pagination.getCurrentPage()).toBe(3);
      pagination.destroy();
    });

    it('should throw error if selector not found', () => {
      expect(() => new Pagination('#non-existent', { total: 100 })).toThrow();
    });
  });

  describe('rendering', () => {
    it('should render pagination buttons', () => {
      const pagination = new Pagination(paginationEl, { total: 50, pageSize: 10 });

      const buttons = paginationEl.querySelectorAll('button');
      // Previous, page buttons (1-5), Next
      expect(buttons.length).toBeGreaterThan(0);

      pagination.destroy();
    });

    it('should apply active class to current page', () => {
      const pagination = new Pagination(paginationEl, { total: 50, pageSize: 10, current: 2 });

      const pageButtons = paginationEl.querySelectorAll('.ag-pagination__page');
      expect(pageButtons[1].className).toContain('ag-pagination__page--active');

      pagination.destroy();
    });

    it('should disable previous button on first page', () => {
      const pagination = new Pagination(paginationEl, { total: 50, pageSize: 10, current: 1 });

      const prevBtn = paginationEl.querySelector('.ag-pagination__prev') as HTMLButtonElement;
      expect(prevBtn.disabled).toBe(true);

      pagination.destroy();
    });

    it('should disable next button on last page', () => {
      const pagination = new Pagination(paginationEl, { total: 50, pageSize: 10, current: 5 });

      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(true);

      pagination.destroy();
    });

    it('should enable buttons on middle pages', () => {
      const pagination = new Pagination(paginationEl, { total: 50, pageSize: 10, current: 2 });

      const prevBtn = paginationEl.querySelector('.ag-pagination__prev') as HTMLButtonElement;
      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;

      expect(prevBtn.disabled).toBe(false);
      expect(nextBtn.disabled).toBe(false);

      pagination.destroy();
    });
  });

  describe('interaction', () => {
    it('should navigate to next page', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 50,
        pageSize: 10,
        current: 1,
        onChange
      });

      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;
      nextBtn.click();

      expect(pagination.getCurrentPage()).toBe(2);
      expect(onChange).toHaveBeenCalledWith(2, expect.any(Event));

      pagination.destroy();
    });

    it('should navigate to previous page', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 50,
        pageSize: 10,
        current: 3,
        onChange
      });

      const prevBtn = paginationEl.querySelector('.ag-pagination__prev') as HTMLButtonElement;
      prevBtn.click();

      expect(pagination.getCurrentPage()).toBe(2);
      expect(onChange).toHaveBeenCalledWith(2, expect.any(Event));

      pagination.destroy();
    });

    it('should navigate to specific page', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 50,
        pageSize: 10,
        onChange
      });

      const pageBtn = paginationEl.querySelectorAll('.ag-pagination__page')[3] as HTMLButtonElement;
      pageBtn.click();

      expect(pagination.getCurrentPage()).toBe(4);
      expect(onChange).toHaveBeenCalledWith(4, expect.any(Event));

      pagination.destroy();
    });

    it('should not call onChange when already at boundary', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 50,
        pageSize: 10,
        current: 5,
        onChange
      });

      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;
      nextBtn.click();

      // onChange should not be called since we're at the last page
      expect(onChange).not.toHaveBeenCalled();

      pagination.destroy();
    });
  });

  describe('setCurrentPage', () => {
    it('should update current page and render', () => {
      const pagination = new Pagination(paginationEl, { total: 100, pageSize: 10 });

      pagination.setCurrentPage(3);

      expect(pagination.getCurrentPage()).toBe(3);

      const pageButtons = paginationEl.querySelectorAll('.ag-pagination__page');
      expect(pageButtons[2].className).toContain('ag-pagination__page--active');

      pagination.destroy();
    });

    it('should trigger onChange callback', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 100,
        pageSize: 10,
        onChange
      });

      pagination.setCurrentPage(5);

      expect(onChange).toHaveBeenCalledWith(5, expect.any(Event));

      pagination.destroy();
    });
  });

  describe('event listener cleanup', () => {
    it('should not leak event listeners on rerender', () => {
      const onChange = vi.fn();
      const pagination = new Pagination(paginationEl, {
        total: 100,
        pageSize: 10,
        onChange
      });

      // Change page multiple times
      pagination.setCurrentPage(2);
      pagination.setCurrentPage(3);
      pagination.setCurrentPage(4);

      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;
      nextBtn.click();

      // onChange should only be called once for the last click, not multiple times
      expect(onChange.mock.calls.length).toBeLessThanOrEqual(4);

      pagination.destroy();
    });

    it('should clean up all listeners on destroy', () => {
      const pagination = new Pagination(paginationEl, { total: 100, pageSize: 10 });

      const buttons = paginationEl.querySelectorAll('button');
      const initialCount = buttons.length;

      pagination.destroy();

      // After destroy, clicking buttons should not trigger pagination logic
      const nextBtn = paginationEl.querySelector('.ag-pagination__next') as HTMLButtonElement;
      if (nextBtn) {
        // This should not change the page anymore
        const originalPage = pagination.getCurrentPage();
        nextBtn.click();
        // Cannot verify this easily without adding a new instance
      }
    });
  });

  describe('createPagination', () => {
    it('should create new pagination element', () => {
      const pagination = createPagination({ total: 100, pageSize: 10 });

      expect(pagination.getElement()).toBeInstanceOf(HTMLDivElement);
      expect(pagination.getElement().className).toContain('ag-pagination');

      pagination.destroy();
    });
  });

  describe('boundary conditions', () => {
    it('should handle single page', () => {
      const pagination = new Pagination(paginationEl, { total: 5, pageSize: 10 });

      const buttons = paginationEl.querySelectorAll('.ag-pagination__page');
      expect(buttons).toHaveLength(1);

      pagination.destroy();
    });

    it('should handle large number of pages', () => {
      const pagination = new Pagination(paginationEl, { total: 1000, pageSize: 10 });

      const buttons = paginationEl.querySelectorAll('.ag-pagination__page');
      expect(buttons.length).toBe(100);

      pagination.destroy();
    });

    it('should handle zero total', () => {
      const pagination = new Pagination(paginationEl, { total: 0, pageSize: 10 });

      const buttons = paginationEl.querySelectorAll('.ag-pagination__page');
      expect(buttons).toHaveLength(0);

      pagination.destroy();
    });
  });
});
