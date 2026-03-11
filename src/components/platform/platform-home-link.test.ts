import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PlatformHomeLink, platformHomeLinkHref, platformHomeLinkLabel } from "./platform-home-link.ts";

test("PlatformHomeLink renders a clear link back to the marketing homepage", () => {
  const markup = renderToStaticMarkup(createElement(PlatformHomeLink));

  assert.match(markup, new RegExp(`href=\"${platformHomeLinkHref}\"`));
  assert.match(markup, new RegExp(`>${platformHomeLinkLabel}<`));
  assert.match(markup, /aria-label="Back to site"/);
});