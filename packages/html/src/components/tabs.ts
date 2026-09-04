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
  tabs?: TabItem[];
  activeKey?: string;
  type?: 'line' | 'card' | 'editable-card';
  onChange?: (key: string) => void;
  onEdit?: (key: string, action: 'add' | 'remove') => void;
  className?: string;
}

export class Tabs {
  private element: HTMLDivElement;
  private options: TabsOptions;
  private tabList: HTMLDivElement;
  private contentList: HTMLDivElement;
  private tabs: Map<string, HTMLDivElement> = new Map();
  private contents: Map<string, HTMLDivElement> = new Map();
  private eventManager = new EventManager();
  private activeKey = '';

  constructor(
    element: HTMLDivElement | string,
    options: TabsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      type: 'line',
      ...options,
    };

    this.tabList = dom.createElement('div', {
      className: 'ag-tabs-tab-list',
    });
    this.element.appendChild(this.tabList);

    this.contentList = dom.createElement('div', {
      className: 'ag-tabs-content-list',
    });
    this.element.appendChild(this.contentList);

    this.bindEvents();

    this.options.tabs?.forEach((tab) => this.addTab(tab));

    if (this.options.activeKey && this.tabs.has(this.options.activeKey)) {
      this.setActiveKey(this.options.activeKey);
    }
  }

  private bindEvents(): void {
    this.eventManager.on(this.tabList, 'click', (e: Event) => {
      const target = e.target as HTMLElement;
      const tab = target.closest('.ag-tabs-tab');

      if (tab instanceof HTMLElement) {
        const key = tab.dataset.key || '';
        if (key && !this.isTabDisabled(key)) {
          this.setActiveKey(key);
        }
      }
    });
  }

  private isTabDisabled(key: string): boolean {
    const tab = this.tabs.get(key);
    return tab?.classList.contains('ag-tabs-tab--disabled') ?? false;
  }

  /**
   * Set active tab
   */
  setActiveKey(key: string): void {
    if (this.isTabDisabled(key)) return;

    this.tabs.forEach((tab) => {
      tab.classList.remove('ag-tabs-tab--active');
    });

    this.contents.forEach((content) => {
      content.style.display = 'none';
    });

    const activeTab = this.tabs.get(key);
    const activeContent = this.contents.get(key);

    if (activeTab) {
      activeTab.classList.add('ag-tabs-tab--active');
    }

    if (activeContent) {
      activeContent.style.display = 'block';
    }

    this.activeKey = key;
    this.options.activeKey = key;
    this.options.onChange?.(key);
  }

  /**
   * Add a tab (and its content pane). Activates it automatically if it's
   * the first tab added or matches the configured `activeKey`.
   */
  addTab(tab: TabItem): void {
    const tabItem = dom.createElement('div', {
      className: 'ag-tabs-tab',
    });
    tabItem.dataset.key = tab.key;

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
        innerHTML:
          '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      });

      this.eventManager.on(close, 'click', (e: Event) => {
        e.stopPropagation();
        this.options.onEdit?.(tab.key, 'remove');
      });

      tabItem.appendChild(close);
    }

    this.tabList.appendChild(tabItem);
    this.tabs.set(tab.key, tabItem);

    const content = dom.createElement('div', {
      className: 'ag-tabs-content-item',
    });
    content.dataset.key = tab.key;
    content.style.display = 'none';

    if (tab.content) {
      content.textContent = tab.content;
    }

    this.contentList.appendChild(content);
    this.contents.set(tab.key, content);

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

    if (this.activeKey === key) {
      const nextKey = this.tabs.keys().next().value;
      if (nextKey) {
        this.setActiveKey(nextKey);
      } else {
        this.activeKey = '';
        this.options.activeKey = undefined;
      }
    }
  }

  /**
   * Set disabled state on a tab
   */
  setTabDisabled(key: string, disabled: boolean): void {
    const tab = this.tabs.get(key);
    if (tab) {
      tab.classList.toggle('ag-tabs-tab--disabled', disabled);
    }
  }

  /**
   * Get active key. Returns an empty string when no tab is active yet.
   */
  getActiveKey(): string {
    return this.activeKey;
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
    this.tabs.forEach((tab) => tab.remove());
    this.tabs.clear();
    this.contents.forEach((content) => content.remove());
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
