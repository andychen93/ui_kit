/** RangeSlider（noUiSlider 底座） */
export interface RangeSliderProps {
  /** 单值模式传 number，双滑块传 [start, end] */
  value?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  /** 滑杆上方气泡提示 */
  tooltips?: boolean;
  disabled?: boolean;
  onChange?: (value: number | [number, number]) => void;
}

/** TagsInput（自研） */
export interface TagsInputProps {
  value?: string[];
  placeholder?: string;
  maxTags?: number;
  onlyUnique?: boolean;
  disabled?: boolean;
  onChange?: (tags: string[]) => void;
}

/** SelectMultiple（自研，原生 multiple 的 chip 化） */
export interface SelectMultipleProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string[]) => void;
}

/** Carousel（自研） */
export interface CarouselItem {
  key?: string;
  /** 图片地址（与 content 二选一） */
  src?: string;
  alt?: string;
  /** 自定义内容（优先于 src） */
  content?: unknown;
  caption?: string;
  description?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  /** 自动轮播间隔 ms，0 关闭 */
  interval?: number;
  /** 底部指示器 */
  indicators?: boolean;
  /** 左右控制箭头 */
  controls?: boolean;
}

/** Dropzone（dropzone 底座） */
export interface DropzoneProps {
  /** 上传地址（dropzone 需要，即使只做本地预览） */
  url?: string;
  acceptedFiles?: string;
  maxFiles?: number;
  maxFilesize?: number;
  /** 展示模式：单文件卡片 / 多文件列表 */
  multiple?: boolean;
  disabled?: boolean;
  hint?: string;
  onAdded?: (file: { name: string; size: number; dataUrl?: string }) => void;
  onRemoved?: () => void;
}

/** VectorMap（自研 SVG 世界地图） */
export interface VectorMapRegionData {
  [countryCode: string]: number;
}

export interface VectorMapProps {
  /** 区域数值（code → value），映射到色阶 */
  data?: Record<string, number>;
  height?: number;
  onRegionClick?: (code: string, name: string) => void;
}
