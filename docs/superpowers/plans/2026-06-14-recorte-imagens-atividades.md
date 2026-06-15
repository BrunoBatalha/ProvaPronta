# Activity Image Cropping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mobile-friendly, browser-only crop step for activity images using `react-easy-crop`, preserving the original image for later edits and using the cropped file in the DOCX.

**Architecture:** Keep crop rendering and file generation separate. `ImageCropEditor` owns temporary interaction state, `imageCropUtils.ts` converts coordinates to a bounded image file, and `ActivityImageUpload` manages selection, preview URLs, editing, replacement, removal, and cleanup.

**Tech Stack:** React 19, TypeScript 6, `react-easy-crop`, Canvas API, Vite 8.

---

### Task 1: Install the crop dependency and extend activity data

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/types/document.ts`
- Modify: `src/lib/activityUtils.ts`

- [ ] Install `react-easy-crop` with `pnpm add react-easy-crop`.
- [ ] Add explicit crop coordinate and activity image state types.
- [ ] Initialize new activities without image resources.
- [ ] Make activity removal return the removed activity so its object URLs can be released by the application.

### Task 2: Generate a bounded cropped image in the browser

**Files:**
- Create: `src/lib/imageCropUtils.ts`

- [ ] Load an object URL into an `HTMLImageElement`.
- [ ] Convert crop coordinates from the source image into a Canvas draw operation.
- [ ] Limit the longest output edge to 2400 pixels to avoid excessive mobile memory usage.
- [ ] Export JPEG sources as JPEG and PNG sources as PNG.
- [ ] Return a typed `File` and a clear error when Canvas export fails.

### Task 3: Build the accessible crop editor

**Files:**
- Create: `src/components/activities/ImageCropEditor.tsx`

- [ ] Render `react-easy-crop` in a modal overlay with free-form crop size.
- [ ] Support drag, pinch zoom, slider zoom, keyboard movement, cancel, confirm, and Escape.
- [ ] Restore the last crop percentages when editing again.
- [ ] Lock background scrolling and restore focus when the dialog closes.
- [ ] Disable confirmation until valid crop coordinates exist or while processing.

### Task 4: Build the activity image upload flow

**Files:**
- Create: `src/components/activities/ActivityImageUpload.tsx`
- Modify: `src/components/activities/ActivityCard.tsx`

- [ ] Validate the original file before opening the editor.
- [ ] Open the editor automatically after a valid selection.
- [ ] Commit the original file, cropped file, preview URLs, and crop state only after confirmation.
- [ ] Preserve the prior image when replacement or editing is canceled.
- [ ] Add `Editar recorte`, `Trocar imagem`, and `Remover imagem` actions.
- [ ] Revoke superseded temporary URLs without revoking active previews.

### Task 5: Integrate preview and lifecycle cleanup

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/preview/DocumentPreview.tsx`

- [ ] Release image URLs when an activity is removed.
- [ ] Release all activity image URLs when the application unmounts.
- [ ] Pass activities into the document preview.
- [ ] Render real statements and cropped activity previews instead of the static example when activities exist.
- [ ] Keep `activity.image` as the cropped file consumed by existing DOCX generation.

### Task 6: Add responsive styles and update product rules

**Files:**
- Modify: `src/App.css`
- Modify: `docs/ABOUT.md`

- [ ] Style upload preview, action buttons, modal overlay, crop surface, slider, errors, and processing state.
- [ ] Make the editor fill the usable mobile viewport with touch-friendly controls.
- [ ] Add reduced-motion behavior and prevent background overflow while editing.
- [ ] Replace the old “do not crop” product rule with the approved automatic crop flow for activity images.

### Task 7: Verify the implementation

**Files:**
- Review all modified files.

- [ ] Run `pnpm build`.
- [ ] Confirm the command exits successfully with TypeScript and Vite build output.
- [ ] Review `git diff --check` and the final diff for unrelated changes.
