import type { DescriptionItem } from "@argon-kit/core";

export interface DescriptionsProps {
  title?: string;
  items: DescriptionItem[];
  column?: number;
  border?: boolean;
}

export function Descriptions({ title, items, column = 1, border = false }: DescriptionsProps) {
  return (
    <div>
      {title ? <h4 className="ag-descriptions__title">{title}</h4> : null}
      <div className={border ? "ag-descriptions ag-descriptions--border" : "ag-descriptions"}>
        <table className="ag-descriptions__table">
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="ag-descriptions__row">
                <td className="ag-descriptions__label">{item.label}</td>
                <td className="ag-descriptions__content">{item.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
