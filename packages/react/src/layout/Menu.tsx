import { glyphs, type GlyphName } from "@argon-kit/icons";
import type { ShellMenuItem } from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";

function MenuIcon({ name }: { name?: string }) {
  if (name && name in glyphs) return <Glyph name={name as GlyphName} />;
  return <span className="ag-menu__dot" />;
}

export function Menu({
  items,
  selectedKey,
  openKeys,
  onSelect,
  onOpenChange,
}: {
  items: ShellMenuItem[];
  selectedKey?: string;
  openKeys: string[];
  onSelect?: (key: string) => void;
  onOpenChange?: (keys: string[]) => void;
}) {
  function toggle(key: string) {
    const next = openKeys.includes(key) ? openKeys.filter((k) => k !== key) : [...openKeys, key];
    onOpenChange?.(next);
  }

  function render(list: ShellMenuItem[]) {
    return (
      <ul className="ag-menu">
        {list.map((item) => {
          const hasKids = Boolean(item.children?.length);
          const open = openKeys.includes(item.key);
          return (
            <li key={item.key}>
              <button
                type="button"
                disabled={item.disabled}
                className={["ag-menu__item", selectedKey === item.key ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => (hasKids ? toggle(item.key) : onSelect?.(item.key))}
              >
                <span className="ag-menu__icon">
                  <MenuIcon name={item.icon} />
                </span>
                <span className="ag-menu__label">{item.label}</span>
                {hasKids ? (
                  <Glyph name="chevronRight" className={["ag-icon", "ag-menu__arrow", open ? "is-open" : ""].join(" ")} />
                ) : null}
              </button>
              {hasKids && open ? render(item.children!) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return render(items);
}
