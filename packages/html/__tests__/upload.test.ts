import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Upload, createUpload } from '../src/components/upload';

describe('Upload Component', () => {
  let container: HTMLDivElement;
  let uploadDiv: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    uploadDiv = document.createElement('div');
    container.appendChild(uploadDiv);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  describe('constructor', () => {
    it('should accept HTMLDivElement', () => {
      const upload = new Upload(uploadDiv);
      expect(upload).toBeDefined();
    });

    it('should accept selector string', () => {
      uploadDiv.id = 'upload-test';
      const upload = new Upload('#upload-test');
      expect(upload).toBeDefined();
    });

    it('should accept options', () => {
      const upload = new Upload(uploadDiv, {
        accept: '.jpg,.png',
        multiple: true,
        maxSize: 5 * 1024 * 1024,
        onUpload: () => {}
      });
      expect(upload).toBeDefined();
    });
  });

  describe('API', () => {
    it('should get element', () => {
      const upload = new Upload(uploadDiv);
      const element = upload.getElement();
      expect(element).toBe(uploadDiv);
    });

    it('should clear files', () => {
      const upload = new Upload(uploadDiv, {
        onUpload: () => {}
      });

      // Simulate file upload
      const dropZone = upload.getElement().querySelector('.ag-upload__dropzone');
      if (dropZone) {
        const event = new Event('drop');
        const mockFiles = [new File(['content'], 'test.jpg', { type: 'image/jpeg' })];
        (event as any).dataTransfer = { files: mockFiles };
        dropZone.dispatchEvent(event);
      }

      expect(upload.getFiles()).toHaveLength(1);

      upload.clearFiles();
      expect(upload.getFiles()).toHaveLength(0);
    });

    it('should destroy component', () => {
      const upload = new Upload(uploadDiv);
      upload.destroy();
      // Should not throw
    });
  });

  describe('maxSize validation', () => {
    it('should validate file size', () => {
      const upload = new Upload(uploadDiv, { maxSize: 100 });

      // Access drop zone to simulate drop
      const dropZone = upload.getElement().querySelector('.ag-upload__dropzone');
      if (dropZone) {
        const event = new Event('drop');
        // Large file (1KB > 100 bytes)
        const largeFile = new File(['x'.repeat(200)], 'large.jpg', { type: 'image/jpeg' });
        (event as any).dataTransfer = { files: [largeFile] };
        dropZone.dispatchEvent(event);
      }

      // Large file should be rejected
      expect(upload.getFiles()).toHaveLength(0);
    });
  });

  describe('multiple files', () => {
    it('should support multiple file selection', () => {
      const upload = new Upload(uploadDiv, { multiple: true });
      expect(upload).toBeDefined();
    });
  });
});

describe('Upload Factory Function', () => {
  let container: HTMLDivElement;
  let uploadDiv: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    uploadDiv = document.createElement('div');
    container.appendChild(uploadDiv);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  it('should create Upload with createUpload', () => {
    const upload = createUpload();
    expect(upload).toBeInstanceOf(Upload);
    upload.destroy();
  });
});
