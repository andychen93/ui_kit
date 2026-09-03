<script lang="ts">
  import { brandIcons, type BrandName } from "@argon-kit/icons";
  import type { Snippet } from "svelte";
  import type { ButtonSize, ButtonVariant } from "./types";

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

  let {
    variant = "primary",
    size = "md",
    loading = false,
    block = false,
    iconOnly = false,
    disabled = false,
    type = "button",
    class: className = "",
    icon,
    children,
    ...rest
  }: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    block?: boolean;
    iconOnly?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    class?: string;
    icon?: Snippet;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();

  const brand = $derived(SOCIAL_BRAND[variant]);
  const brandIcon = $derived(brand ? brandIcons[brand] : null);
  const classes = $derived(
    [
      "ag-btn",
      `ag-btn--${variant}`,
      size !== "md" ? `ag-btn--${size}` : "",
      loading ? "ag-btn--loading" : "",
      block ? "ag-btn--block" : "",
      iconOnly ? "ag-btn--icon-only" : "",
      className,
    ]
      .filter(Boolean)
      .join(" "),
  );
</script>

<button {type} class={classes} disabled={disabled || loading} {...rest}>
  {#if loading}
    <span class="ag-btn__spinner"></span>
  {:else if icon}
    {@render icon()}
  {:else if brandIcon}
    <svg class="ag-btn__icon" viewBox={brandIcon.viewBox} aria-hidden="true">
      <path d={brandIcon.path} fill="currentColor" />
    </svg>
  {/if}
  {@render children?.()}
</button>
