<script setup lang="ts">
import { glyphs, type GlyphName } from "@argon-kit/icons";

const props = defineProps<{ name: GlyphName; class?: string }>();
</script>

<template>
  <svg
    :class="props.class ?? 'ag-icon'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="d in glyphs[props.name].paths" :key="d" :d="d" />
  </svg>
</template>
