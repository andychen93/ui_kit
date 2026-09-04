/**
 * Argon UI Kit - HTML Editor Plugin (Quill wrapper)
 */

import Quill from 'quill';

export interface RichTextOptions {
  theme?: string;
  modules?: any;
  placeholder?: string;
}

export class RichText {
  private quill: Quill;
  private container: HTMLElement;

  constructor(container: HTMLElement | string, options: RichTextOptions = {}) {
    if (typeof container === 'string') {
      const element = document.querySelector<HTMLElement>(container);
      if (!element) {
        throw new Error(`Editor container not found for selector: ${container}`);
      }
      this.container = element;
    } else {
      this.container = container;
    }

    this.quill = new Quill(this.container, {
      theme: options.theme || 'snow',
      modules: options.modules || {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video']
        ]
      },
      placeholder: options.placeholder
    });
  }

  /**
   * Get HTML content
   */
  getHTML(): string {
    return this.container.querySelector('.ql-editor')?.innerHTML || '';
  }

  /**
   * Set HTML content
   */
  setHTML(html: string): void {
    this.quill.root.innerHTML = html;
  }

  /**
   * Get text content
   */
  getText(): string {
    return this.quill.getText();
  }

  /**
   * Focus editor
   */
  focus(): void {
    this.quill.focus();
  }

  /**
   * Enable/disable editor
   */
  setEnabled(enabled: boolean): void {
    this.quill.enable(enabled);
  }

  /**
   * Get Quill instance
   */
  getQuill(): Quill {
    return this.quill;
  }
}

export default RichText;
