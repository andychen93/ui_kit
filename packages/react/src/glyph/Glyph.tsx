import { glyphs, type GlyphName } from "@argon-kit/icons";

export function Glyph({
  name,
  className = "ag-icon",
}: {
  name: GlyphName;
  className?: string;
}) {
  const glyph = glyphs[name];
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
