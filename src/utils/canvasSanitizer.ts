/**
 * Helper to sanitize DOM cloned elements for html2canvas.
 * Tailwind CSS v4 outputs modern CSS color functions like `oklch(...)`, which
 * html2canvas 1.4.1 does not support and throws:
 * "Attempting to parse an unsupported color function 'oklch'"
 *
 * This function walks every element in the cloned document and converts all
 * computed/inline oklch colors and gradient functions to standard sRGB / RGBA / HEX,
 * ensuring clean high-DPI PDF generation without crashing.
 */
export function sanitizeElementForCanvas(clonedDoc: Document) {
  const COLOR_PROPS = [
    "color",
    "background-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
    "fill",
    "stroke",
    "box-shadow",
    "text-decoration-color",
  ];

  // Resolver canvas context to quickly convert ANY browser-supported color format
  // (including modern oklch, oklab, color(srgb ...), etc.) to standard rgba()
  const canvas = clonedDoc.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");

  function colorToRgb(colorStr: string, fallback = "#0f172a"): string {
    if (!ctx) return fallback;
    try {
      ctx.fillStyle = "#ffffff"; // reset
      ctx.fillStyle = colorStr;
      // If the browser parsed it into canvas context, fillStyle becomes an rgb(...) or hex string!
      const resolved = ctx.fillStyle;
      if (resolved && !resolved.includes("oklch")) {
        return resolved;
      }
    } catch {
      // Ignore
    }
    return fallback;
  }

  // Remove or replace any stylesheet rules containing oklch in the clone
  try {
    const styleTags = clonedDoc.querySelectorAll("style");
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && styleTag.textContent.includes("oklch")) {
        // Replace oklch(...) occurrences in embedded CSS
        styleTag.textContent = styleTag.textContent.replace(
          /oklch\([^)]+\)/gi,
          (match) => colorToRgb(match, "#334155")
        );
      }
    });
  } catch {
    // Ignore cross-origin stylesheet errors
  }

  const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
  allElements.forEach((el) => {
    // 1. Process inline styles
    const inlineStyle = el.getAttribute("style");
    if (inlineStyle && inlineStyle.includes("oklch")) {
      const sanitizedStyle = inlineStyle.replace(
        /oklch\([^)]+\)/gi,
        (match) => colorToRgb(match, "#0f172a")
      );
      el.setAttribute("style", sanitizedStyle);
    }

    // 2. Process computed style properties that might hold oklch
    try {
      const computed = window.getComputedStyle(el);
      COLOR_PROPS.forEach((prop) => {
        const val = computed.getPropertyValue(prop);
        if (val && val.includes("oklch")) {
          const fallback = prop === "background-color" ? "#ffffff" : prop.includes("border") ? "#cbd5e1" : "#0f172a";
          const converted = val.replace(/oklch\([^)]+\)/gi, (m) => colorToRgb(m, fallback));
          el.style.setProperty(prop, converted, "important");
        }
      });

      // Also check background-image gradients that might embed oklch
      const bgImg = computed.getPropertyValue("background-image");
      if (bgImg && bgImg.includes("oklch")) {
        const convertedBg = bgImg.replace(/oklch\([^)]+\)/gi, (m) => colorToRgb(m, "#0f172a"));
        el.style.setProperty("background-image", convertedBg, "important");
      }
    } catch {
      // Element might be detached
    }
  });
}
