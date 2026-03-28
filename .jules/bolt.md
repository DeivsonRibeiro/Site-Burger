# Bolt's Performance Journal ⚡

## 2026-02-03 - Image Optimization Strategy
**Learning:** For implementing modern image formats like WebP in CSS, using `image-set()` is more robust and cleaner than using `@supports` with a data URI. `image-set()` provides built-in fallback mechanisms that browsers handle efficiently without extra complex logic. Also, when working with static sites, always prefer relative paths over root-relative paths to ensure portability across different hosting environments.
**Action:** Use `image-set()` for background images and ensure relative paths are used for all assets.
