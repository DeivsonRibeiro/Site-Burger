# Bolt's Journal - Critical Learnings

## 2024-05-24 - Optimization of Large Assets and BOM Handling
**Learning:** Some files in this codebase (like `estilos/styles.css`) contain a Byte Order Mark (BOM) and non-ASCII characters. Standard tools like `sed` or `replace_with_git_merge_diff` can fail or produce unexpected results if the BOM isn't handled. Additionally, for WebP support detection in CSS, using a data URI in `@supports` is more reliable than checking a file path.

**Action:**
1. Always check for and remove BOM using `sed -i '1s/^\xef\xbb\xbf//' [file]` if encountered.
2. Use `@supports (background-image: url("data:image/webp;base64,..."))` for robust WebP feature detection.
3. Quantify performance wins: replacing a 7.8MB image with a 233KB WebP resulted in a ~97% reduction in asset size.
