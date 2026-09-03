<script setup lang="ts">
import { computed } from "vue";

export type AvatarSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    size?: AvatarSize;
    square?: boolean;
  }>(),
  { size: "md", square: false },
);

const className = computed(() =>
  [
    "ag-avatar",
    props.size !== "md" ? `ag-avatar--${props.size}` : "",
    props.square ? "ag-avatar--square" : "",
  ]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <span :class="className">
    <img v-if="src" :src="src" :alt="alt || ''" />
    <slot v-else />
  </span>
</template>
