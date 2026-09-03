<script setup lang="ts">
import { computed, ref } from "vue";
import {
  regionColor,
  regionStats,
  worldRegions,
  type VectorMapProps,
} from "../../core/worldMap";

const props = withDefaults(defineProps<VectorMapProps>(), {
  data: () => ({}),
  height: 320,
});

const emit = defineEmits<{ regionClick: [code: string, name: string] }>();

const hover = ref<{ name: string; value?: number; x: number; y: number } | null>(null);

const stats = computed(() => regionStats(props.data));

function onMove(e: MouseEvent, region: (typeof worldRegions)[number]) {
  const svg = (e.currentTarget as SVGElement).closest("svg");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  hover.value = {
    name: region.name,
    value: props.data[region.code],
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
</script>

<template>
  <div class="ag-vec" :style="{ height: height + 'px' }">
    <svg viewBox="0 0 1000 500" style="width: 100%; height: 100%; display: block">
      <path
        v-for="region in worldRegions"
        :key="region.code"
        :d="region.d"
        :fill="regionColor(data[region.code], stats.max)"
        stroke="#fff"
        stroke-width="1.5"
        style="cursor: pointer"
        @mousemove="onMove($event, region)"
        @mouseleave="hover = null"
        @click="emit('regionClick', region.code, region.name)"
      />
    </svg>
    <div
      v-if="hover"
      class="ag-vec__tip"
      :style="{ left: hover.x + 12 + 'px', top: hover.y - 8 + 'px' }"
    >
      {{ hover.name }}{{ hover.value !== undefined ? `：${hover.value}` : "" }}
    </div>
    <div class="ag-vec__legend">
      低 <span class="ag-vec__ramp" /> 高 ｜ 合计 {{ stats.total }}
    </div>
  </div>
</template>
