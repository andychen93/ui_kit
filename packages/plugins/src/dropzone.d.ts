declare module "dropzone" {
  export interface DropzoneFile extends File {
    dataUrl?: string;
  }

  export interface DropzoneOptions {
    url?: string | ((files: File[]) => string);
    acceptedFiles?: string;
    maxFiles?: number | null;
    maxFilesize?: number;
    addRemoveLinks?: boolean;
    previewTemplate?: string;
    clickable?: boolean | string | HTMLElement | Array<string | HTMLElement>;
    dictDefaultMessage?: string;
    autoProcessQueue?: boolean;
    init?: (this: Dropzone) => void;
    [key: string]: unknown;
  }

  export default class Dropzone {
    static autoDiscover: boolean;
    constructor(el: HTMLElement | string, options?: DropzoneOptions);
    on(event: string, callback: (...args: never[]) => void): this;
    destroy(): void;
    destroy(revert?: boolean): void;
    processQueue(): void;
    removeAllFiles(cancel?: boolean): void;
  }
}
