/**
 * Upload component
 */

import * as dom from '../utils/dom';
import { EventManager, preventDefault } from '../utils/event';
import { ChangeHandler } from '../types/index';

export interface UploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  onUpload?: ChangeHandler<File[]>;
}

export class Upload {
  private element: HTMLDivElement;
  private input: HTMLInputElement;
  private options: UploadOptions;
  private files: File[] = [];
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: UploadOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = options;
    this.input = this.createInput();
    this.init();
  }

  private createInput(): HTMLInputElement {
    const input = dom.createElement('input', {
      attributes: {
        type: 'file',
        accept: this.options.accept || '',
        multiple: this.options.multiple ? 'multiple' : undefined
      }
    });

    dom.addClass(input, 'ag-upload__input');
    input.style.display = 'none';

    return input;
  }

  private init(): void {
    dom.addClass(this.element, 'ag-upload');

    this.element.appendChild(this.input);

    // Create drop zone
    const dropZone = dom.createElement('div', {
      className: 'ag-upload__dropzone'
    });

    dropZone.innerHTML = `
      <div class="ag-upload__icon">📁</div>
      <p class="ag-upload__text">Drag files here or click to upload</p>
    `;

    this.element.appendChild(dropZone);

    // Bind events
    this.eventManager.on(dropZone, 'click', () => this.input.click());
    this.eventManager.on(this.input, 'change', (e) => this.handleFileSelect(e));

    // Drag and drop
    this.eventManager.on(dropZone, 'dragover', (e) => {
      preventDefault(e);
      dom.addClass(dropZone, 'ag-upload__dropzone--active');
    });

    this.eventManager.on(dropZone, 'dragleave', () => {
      dom.removeClass(dropZone, 'ag-upload__dropzone--active');
    });

    this.eventManager.on(dropZone, 'drop', (e) => {
      preventDefault(e);
      dom.removeClass(dropZone, 'ag-upload__dropzone--active');
      const dragEvent = e as DragEvent;
      if (dragEvent.dataTransfer?.files) {
        this.handleFiles(Array.from(dragEvent.dataTransfer.files));
      }
    });
  }

  private handleFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]): void {
    const validFiles: File[] = [];

    files.forEach(file => {
      if (this.options.maxSize && file.size > this.options.maxSize) {
        console.warn(`File ${file.name} exceeds max size`);
        return;
      }
      validFiles.push(file);
    });

    if (this.options.multiple) {
      this.files = [...this.files, ...validFiles];
    } else {
      this.files = validFiles.slice(0, 1);
    }

    if (this.options.onUpload) {
      this.options.onUpload(this.files, new Event('upload'));
    }
  }

  /**
   * Get files
   */
  getFiles(): File[] {
    return this.files;
  }

  /**
   * Clear files
   */
  clearFiles(): void {
    this.files = [];
    this.input.value = '';
  }

  /**
   * Get element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.files = [];
  }
}

/**
 * Create upload
 */
export function createUpload(options: UploadOptions = {}): Upload {
  const div = dom.createElement('div', {
    className: 'ag-upload'
  });

  const instance = new Upload(div, options);
  return instance;
}
