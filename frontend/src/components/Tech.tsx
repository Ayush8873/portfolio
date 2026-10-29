import type { CSSProperties } from "react";
import { techIcon } from "@/lib/tech";

/** The SVG mark is used as a mask so it takes the brand colour in either theme. */
export function TechIcon({ label, size = 16 }: { label: string; size?: number }) {
  const icon = techIcon(label);
  if (!icon) return null;
  const style = {
    "--ti-src": `url(${icon.src})`,
    "--ti-color": icon.color ?? "var(--text)",
    width: size,
    height: size,
  } as CSSProperties;
  return <span className="ti" style={style} aria-hidden />;
}

/** A chip with its tech logo. `warn` marks work still in progress. */
export function TechChip({ label }: { label: string }) {
  const warn = /in progress|POC/.test(label);
  return (
    <li className={`chip${warn ? " chip-warn" : ""}`}>
      <TechIcon label={label} size={14} />
      {label}
    </li>
  );
}
