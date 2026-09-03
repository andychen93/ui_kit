<script setup lang="ts">
import { computed, useSlots } from "vue";
import { brandIcons, type BrandName } from "@argon-kit/icons";
import type { ButtonSize, ButtonVariant } from "./types";

export type { ButtonSize, ButtonVariant };

const SOCIAL_BRAND: Partial<Record<ButtonVariant, BrandName>> = {
  "social-github": "github",
  "social-google": "google",
  "social-wechat": "wechat",
  "social-facebook": "facebook",
  "social-twitter": "twitter",
  "social-pinterest": "pinterest",
  "social-linkedin": "linkedin",
  "social-dribbble": "dribbble",
  "social-youtube": "youtube",
  "social-instagram": "instagram",
  "social-reddit": "reddit",
  "social-tumblr": "tumblr",
  "social-behance": "behance",
  "social-vimeo": "vimeo",
  "social-slack": "slack",
};

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    block?: boolean;
    iconOnly?: boolean;
    disabled?: boolean;
    type?: HTMLButtonElement["type"];
  }>(),
  {
    variant: "primary",
    size: "md",
    loading: false,
    block: false,
    iconOnly: false,
    disabled: false,
    type: "button",
  },
);

defineOptions({ inheritAttrs: false });

const slots = useSlots();

const className = computed(() =>
  [
    "ag-btn",
    `ag-btn--${props.variant}`,
    props.size !== "md" ? `ag-btn--${props.size}` : "",
    props.loading ? "ag-btn--loading" : "",
    props.block ? "ag-btn--block" : "",
    props.iconOnly ? "ag-btn--icon-only" : "",
  ]
    .filter(Boolean)
    .join(" "),
);

const brand = computed(() => SOCIAL_BRAND[props.variant]);
const brandIcon = computed(() =>
  brand.value ? brandIcons[brand.value] : null,
);
const hasIconSlot = computed(() => Boolean(slots.icon));
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :class="className"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ag-btn__spinner" />
    <slot v-else-if="hasIconSlot" name="icon" />
    <svg
      v-else-if="brandIcon"
      class="ag-btn__icon"
      :viewBox="brandIcon.viewBox"
      aria-hidden="true"
    >
      <path :d="brandIcon.path" fill="currentColor" />
    </svg>
    <slot />
  </button>
</template>
