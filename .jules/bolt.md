## 2024-01-16 - Initial Image Optimization

**Learning:** The project's CSS uses large, unoptimized JPG images for backgrounds, which are prime targets for optimization. The 7.8MB `imagem_header.jpg` was a major bottleneck.

**Action:** When profiling, always check the `imgs/` directory for large images and audit the CSS to see how they are used. Prioritize optimizing images that are loaded above the fold.
