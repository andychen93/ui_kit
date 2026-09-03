/** Dropzone 内部结构（上传箭头 + 标题 + 描述），三框架共用 */
export const UPLOAD_ICON = `<svg class="ag-dz__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 8 5-5 5 5"/><path d="M12 3v12"/></svg>`;

export function dzInner(hint: string, sub: string) {
  return `<div class="ag-dz__inner"><span class="ag-dz__icon-wrap">${UPLOAD_ICON}</span><p class="ag-dz__title">${hint}</p><p class="ag-dz__sub">${sub}</p></div>`;
}

/** 缩略图预览模板（dropzone data-dz-* 钩子） */
export const DZ_PREVIEW_TEMPLATE = `
<div class="dz-preview dz-file-preview">
  <div class="dz-image"><img data-dz-thumbnail /></div>
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size"><span data-dz-size></span></div>
  </div>
  <a class="dz-remove" href="javascript:undefined;" data-dz-remove>删除</a>
</div>`;

