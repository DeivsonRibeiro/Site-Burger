## 2024-07-16 - CSS Background Image Fallback Order
**Learning:** When using `image-set()` or multiple `background-image` declarations for WebP fallbacks, the order is critical. The browser uses the *last* supported declaration it finds. Therefore, the generic fallback (e.g., JPG/PNG) must be listed *before* the `image-set()` or `-webkit-image-set()` declarations. Placing it after will cause modern browsers to ignore the WebP version and use the fallback instead, defeating the optimization.

**Action:** Always declare the most basic image format first, followed by progressively enhanced versions like WebP using `image-set()`.

## 2024-07-16 - Avoid Committing Verification Artifacts
**Learning:** Running a local server for verification can produce temporary files (e.g., `server.log`). These files are not part of the source code and should not be committed to the repository. The same applies to ad-hoc verification scripts (`verify_optimization.py`) and their outputs (`verification_screenshot.png`).

**Action:** Always check `git status` before committing to identify untracked files. Add common temporary file patterns like `*.log` to a `.gitignore` file to prevent them from being accidentally staged. Delete verification scripts and screenshots after use.
