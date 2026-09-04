import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RichText } from '../src/index';

describe('HTML Editor Plugin', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should accept HTMLElement', () => {
      const editor = new RichText(container);
      expect(editor).toBeDefined();
    });

    it('should accept selector string', () => {
      container.id = 'editor-container';
      const editor = new RichText('#editor-container');
      expect(editor).toBeDefined();
    });

    it('should throw error if selector not found', () => {
      expect(() => {
        new RichText('#non-existent-editor');
      }).toThrow('Editor container not found for selector: #non-existent-editor');
    });
  });

  describe('API', () => {
    it('should get HTML content', () => {
      const editor = new RichText(container);
      const html = editor.getHTML();
      expect(typeof html).toBe('string');
    });

    it('should set HTML content', () => {
      const editor = new RichText(container);
      editor.setHTML('<p>Test content</p>');
      const html = editor.getHTML();
      expect(html).toContain('Test content');
    });

    it('should get text content', () => {
      const editor = new RichText(container);
      const text = editor.getText();
      expect(typeof text).toBe('string');
    });

    it('should focus editor', () => {
      const editor = new RichText(container);
      expect(() => editor.focus()).not.toThrow();
    });

    it('should enable/disable editor', () => {
      const editor = new RichText(container);
      editor.setEnabled(false);
      editor.setEnabled(true);
    });

    it('should get Quill instance', () => {
      const editor = new RichText(container);
      const quill = editor.getQuill();
      expect(quill).toBeDefined();
    });
  });
});
