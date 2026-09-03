import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { brandIcons, type BrandName } from "@argon-kit/icons";

export type ButtonVariant =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "default"
  | "neutral"
  | "outline"
  | "link"
  | "gradient-primary"
  | "gradient-info"
  | "gradient-success"
  | "gradient-warning"
  | "gradient-danger"
  | "gradient-default"
  | "social-github"
  | "social-google"
  | "social-wechat"
  | "social-facebook"
  | "social-twitter"
  | "social-pinterest"
  | "social-linkedin"
  | "social-dribbble"
  | "social-youtube"
  | "social-instagram"
  | "social-reddit"
  | "social-tumblr"
  | "social-behance"
  | "social-vimeo"
  | "social-slack";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  icon?: ReactNode;
}

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

function BrandSvg({ name }: { name: BrandName }) {
  const icon = brandIcons[name];
  return (
    <svg className="ag-btn__icon" viewBox={icon.viewBox} aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  iconOnly = false,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "ag-btn",
    `ag-btn--${variant}`,
    size !== "md" ? `ag-btn--${size}` : "",
    loading ? "ag-btn--loading" : "",
    block ? "ag-btn--block" : "",
    iconOnly ? "ag-btn--icon-only" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const brand = SOCIAL_BRAND[variant];
  const leading = loading ? (
    <span className="ag-btn__spinner" />
  ) : icon ? (
    icon
  ) : brand ? (
    <BrandSvg name={brand} />
  ) : null;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {leading}
      {children}
    </button>
  );
}
