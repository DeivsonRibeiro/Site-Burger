## 2026-02-04 - Large background image bottleneck
**Learning:** Found a 7.8MB background image in the header, which is a major performance anti-pattern for static sites. Converting to WebP and compressing the fallback JPG reduced the asset size by over 90%.
**Action:** Always check the `imgs/` directory and CSS for large assets that block the initial page load.

## 2026-02-04 - WebP Detection in CSS
**Learning:** Using `@supports (background-image: url("file.webp"))` only checks if the browser understands the `url()` syntax. To reliably detect WebP codec support, a data-URI of a minimal WebP image should be used.
**Action:** Use `@supports (background-image: url("data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="))` for more reliable WebP feature detection in CSS.
