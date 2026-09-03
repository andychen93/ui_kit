import { type ReactNode, useState } from "react";
import type { BreadcrumbItem, ShellMenuItem } from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";
import { Breadcrumb } from "./Breadcrumb";
import { Menu } from "./Menu";

export interface AppShellProps {
  brand?: string;
  logo?: string;
  items?: ShellMenuItem[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  pinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  breadcrumb?: BreadcrumbItem[];
  extra?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  embed?: boolean;
}

export function AppShell({
  brand = "Argon",
  logo = "A",
  items = [],
  selectedKey,
  onSelect,
  pinned = true,
  onPinnedChange,
  breadcrumb = [],
  extra,
  footer,
  children,
  embed,
}: AppShellProps) {
  const [hover, setHover] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return (
    <div className={["ag-app", pinned ? "is-pinned" : "", embed ? "ag-app--embed" : ""].filter(Boolean).join(" ")}>
      <aside
        className={["ag-sidenav", hover && !pinned ? "is-hover" : ""].filter(Boolean).join(" ")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="ag-sidenav__brand">
          <span className="ag-sidenav__logo">{logo}</span>
          <span className="ag-sidenav__brand-text">{brand}</span>
        </div>
        <nav aria-label="侧栏导航">
          <Menu
            items={items}
            selectedKey={selectedKey}
            openKeys={pinned || hover ? openKeys : []}
            onSelect={onSelect}
            onOpenChange={setOpenKeys}
          />
        </nav>
      </aside>
      <div className="ag-app__main">
        <header className="ag-header">
          <div className="ag-header__left">
            <button
              type="button"
              className="ag-header__toggle"
              aria-label={pinned ? "收起侧栏" : "展开侧栏"}
              onClick={() => onPinnedChange?.(!pinned)}
            >
              <Glyph name="menu" />
            </button>
            {breadcrumb.length ? <Breadcrumb items={breadcrumb} /> : null}
          </div>
          <div className="ag-header__right">{extra}</div>
        </header>
        <div className="ag-page">{children}</div>
        {footer ? <footer className="ag-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
