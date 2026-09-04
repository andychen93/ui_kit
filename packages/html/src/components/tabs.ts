/**
 * Tabs component
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface TabItem {
  key: string;
  title?: string;
  content?: string;
  disabled?: boolean;
  className?: string;
}

export interface TabsOptions {
  activeKey?: string;
  type?: 'line' | 'card' | 'editable-card';
  onChange?: (key: string) => void;
  onEdit?: (key: string, action: 'add' | 'remove') => void;
  className?: string;
}

export class Tabs {
  private element: HTMLDivElement;
  private options: TabsOptions;
  private tabList: HTMLDivElement | null;
  private contentList: HTMLDivElement | null;
  private tabs: Map<string, HTMLDivElement> = new Map();
  private contents: Map<string, HTMLDivElement> = new Map();
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: TabsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      activeKey: '',
      type: 'line',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createTabs();
    this.createContent();
    this.bindEvents();
  }

  private createTabs(): void {
    const tabList = dom.createElement('div', {
      className: 'ag-tabs-tab-list',
    });

    this.element.appendChild(tabList);
    this.tabList = tabList;

    this.options.tabs?.forEach(tab => {
      this.addTab(tab);
    });
  }

  private createContent(): void {
    const contentList = dom.createElement('div', {
      className: 'ag-tabs-content-list',
    });

    this.element.appendChild(contentList);
    this.contentList = contentList;

    this.options.tabs?.forEach(tab => {
      const content = dom.createElement('div', {
        className: 'ag-tabs-content-item',
        attributes: {
          'data-key': tab.key,
        },
      });

      if (tab.content) {
        content.textContent = tab.content;
      }

      contentList.appendChild(content);
      this.contents.set(tab.key, content);

      // Hide inactive tabs
      if (this.options.activeKey !== tab.key) {
        content.style.display = 'none';
      }
    });
  }

  private bindEvents(): void {
    if (this.tabList) {
      this.eventManager.on(this.tabList, 'click', (e) => {
        const target = e.target as HTMLElement;
        const tab = target.closest('.ag-tabs-tab');
        
        if (tab) {
          const key = tab.dataset.key || '';
          if (key && !this.isTabDisabled(key)) {
            this.setActiveKey(key);
          }
        }
      });
    }
  }

  private addTab(tab: TabItem): void {
    const tabItem = dom.createElement('div', {
      className: 'ag-tabs-tab',
      attributes: {
        'data-key': tab.key,
      },
    });

    if (tab.disabled) {
      tabItem.classList.add('ag-tabs-tab--disabled');
    }

    if (tab.title) {
      const title = dom.createElement('span', {
        className: 'ag-tabs-tab-title',
        textContent: tab.title,
      });
      tabItem.appendChild(title);
    }

    if (this.options.type === 'editable-card') {
      const close = dom.createElement('span', {
        className: 'ag-tabs-tab-close',
        innerHTML: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      });

      close.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.options.onEdit) {
          this.options.onEdit(tab.key, 'remove');
        }
      });

      tabItem.appendChild(close);
    }

    if (this.tabList) {
      this.tabList.appendChild(tabItem);
    }
    this.tabs.set(tab.key, tabItem);
  }

  private isTabDisabled(key: string): boolean {
    const tab = this.tabs.get(key);
    return tab?.classList.contains('ag-tabs-tab--disabled') || false;
  }

  /**
   * Set active tab
   */
  setActiveKey(key: string): void {
    // Deselect all tabs
    this.tabs.forEach(tab => {
      tab.classList.remove('ag-tabs-tab--active');
    });

    // Hide all contents
    this.contents.forEach(content => {
      content.style.display = 'none';
    });

    // Select the requested tab
    const activeTab = this.tabs.get(key);
    const activeContent = this.contents.get(key);

    if (activeTab) {
      activeTab.classList.add('ag-tabs-tab--active');
    }

    if (activeContent) {
      activeContent.style.display = 'block';
    }

    this.options.activeKey = key;

    if (this.options.onChange) {
      this.options.onChange(key);
    }
  }

  /**
   * Add tab
   */
  addTab(tab: TabItem): void {
    if (!this.tabList || !this.contentList) return;

    const tabItem = dom.createElement('div', {
      className: 'ag-tabs-tab',
      attributes: {
        'data-key': tab.key,
      },
    });

    if (tab.title) {
      const title = dom.createElement('span', {
        className: 'ag-tabs-tab-title',
        textContent: tab.title,
      });
      tabItem.appendChild(title);
    }

    if (tab.disabled) {
      tabItem.classList.add('ag-tabs-tab--disabled');
    }

    if (this.options.type === 'editable-card') {
      const close = dom.createElement('span', {
        className: 'ag-tabs-tab-close',
        innerHTML: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      });

      close.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.options.onEdit) {
          this.options.onEdit(tab.key, 'remove');
        }
      });

      tabItem.appendChild(close);
    }

    this.tabList.appendChild(tabItem);
    this.tabs.set(tab.key, tabItem);

    // Add content
    const content = dom.createElement('div', {
      className: 'ag-tabs-content-item',
      attributes: {
        'data-key': tab.key,
      },
    });

    if (tab.content) {
      content.textContent = tab.content;
    }

    this.contentList.appendChild(content);
    this.contents.set(tab.key, content);

    // If this is the first tab or set as active, activate it
    if (this.tabs.size === 1 || this.options.activeKey === tab.key) {
      this.setActiveKey(tab.key);
    }
  }

  /**
   * Remove tab
   */
  removeTab(key: string): void {
    const tab = this.tabs.get(key);
    const content = this.contents.get(key);

    if (tab) {
      tab.remove();
      this.tabs.delete(key);
    }

    if (content) {
      content.remove();
      this.contents.delete(key);
    }
  }

  /**
   * Get active key
   */
  getActiveKey(): string {
    return this.options.activeKey;
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.tabs.forEach(tab => {
      tab.remove();
    });
    this.tabs.clear();
    this.contents.forEach(content => {
      content.remove();
    });
    this.contents.clear();
  }
}

/**
 * Create tabs from scratch
 */
export function createTabs(options: TabsOptions = {}): Tabs {
  const container = dom.createElement('div', {
    className: 'ag-tabs',
  });

  const instance = new Tabs(container, options);
  return instance;
}
