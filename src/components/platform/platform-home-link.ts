import { ArrowUpLeft } from "lucide-react";
import { createElement } from "react";

export const platformHomeLinkHref = "/";
export const platformHomeLinkLabel = "Back to site";
export const platformHomeLinkClassName =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/72 transition hover:border-cyan-300/40 hover:text-white";

export function PlatformHomeLink() {
  return createElement(
    "a",
    {
      href: platformHomeLinkHref,
      className: platformHomeLinkClassName,
      "aria-label": platformHomeLinkLabel,
    },
    createElement(ArrowUpLeft, { className: "size-3.5", "aria-hidden": true }),
    createElement("span", null, platformHomeLinkLabel),
  );
}