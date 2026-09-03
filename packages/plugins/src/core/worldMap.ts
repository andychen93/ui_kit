/**
 * 自研轻量世界地图（零依赖，规避 jvectormap 的 AGPL 许可）。
 * 低精度大陆轮廓 + 区域数据着色 + hover 提示。
 * 视觉对齐 Argon vector map：灰底区域 + 主色系数据色阶。
 */

import { agGray, agPalette, hexToRgb } from "@argon-kit/styles/tokens";

export interface MapRegion {
  /** 区域代码（ISO 大洲/国家码） */
  code: string;
  name: string;
  /** 简化轮廓 path（viewBox 0 0 1000 500） */
  d: string;
}

/** 低精度大陆/次大陆轮廓（视觉示意用，非地理精确） */
export const worldRegions: MapRegion[] = [
  { code: "NA", name: "北美洲", d: "M120,90 L200,70 L280,85 L320,120 L300,180 L260,230 L230,300 L200,330 L180,280 L150,220 L130,160 Z" },
  { code: "SA", name: "南美洲", d: "M240,320 L290,310 L320,340 L310,390 L290,440 L265,470 L250,430 L240,380 Z" },
  { code: "EU", name: "欧洲", d: "M480,80 L560,70 L610,90 L620,130 L590,160 L540,150 L500,140 L470,115 Z" },
  { code: "AF", name: "非洲", d: "M490,170 L580,160 L620,200 L610,260 L580,320 L545,370 L515,350 L495,290 L480,230 Z" },
  { code: "AS", name: "亚洲", d: "M630,70 L780,60 L900,90 L940,140 L900,200 L850,250 L790,270 L730,240 L680,190 L640,140 Z" },
  { code: "SE", name: "东南亚", d: "M790,280 L840,270 L870,300 L850,340 L800,330 L780,305 Z" },
  { code: "OC", name: "大洋洲", d: "M820,360 L880,350 L910,380 L890,420 L840,425 L815,395 Z" },
];

export type { VectorMapProps } from "./types";

/** 按数值在色阶中取色（无数据 → gray-200 底；有数据 → primary→info 插值） */
export function regionColor(value: number | undefined, max: number): string {
  if (value === undefined || Number.isNaN(value)) return agGray[200];
  const t = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const from = hexToRgb(agPalette.primary);
  const to = hexToRgb(agPalette.info);
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function regionStats(data: Record<string, number> | undefined) {
  const values = Object.values(data ?? {});
  const max = values.length ? Math.max(...values) : 0;
  const total = values.reduce((a, b) => a + b, 0);
  return { max, total };
}
