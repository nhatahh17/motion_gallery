# Loading Intro Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained Phase 9 loading intro that replaces the raw loading state without blocking gallery access after data is ready.

**Architecture:** Keep intro display rules in a pure helper under `src/lib/gallery/intro.ts` so behavior is unit-testable. Render a small client component from `GalleryExperience` only while gallery data is loading, with reduced-motion-friendly styling and no timers.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, CSS.

---

### Task 1: Story And Harness Setup

**Files:**
- Create: `docs/stories/epics/E01-foundation/US-010-loading-intro-polish.md`
- Modify: `docs/TEST_MATRIX.md`

- [ ] **Step 1: Create story packet**

Create US-010 with normal lane, Phase 9 product contract, acceptance criteria, validation ladder, and empty evidence.

- [ ] **Step 2: Add durable story row**

Run: `.\scripts\bin\harness-cli.exe story add --id US-010 --title "Loading intro polish" --lane normal --verify "npm.cmd run test -- src/lib/gallery/intro.test.ts"`

Expected: story row exists or reports that it already exists.

### Task 2: Intro State Helper

**Files:**
- Create: `src/lib/gallery/intro.test.ts`
- Create: `src/lib/gallery/intro.ts`

- [ ] **Step 1: Write failing tests**

Tests cover loading visibility, ready/error hidden states, reduced-motion copy, and progress labels.

- [ ] **Step 2: Run red test**

Run: `npm.cmd run test -- src/lib/gallery/intro.test.ts`

Expected: fail because `src/lib/gallery/intro.ts` does not exist.

- [ ] **Step 3: Implement helper**

Add `getLoadingIntroState` with a small typed input and deterministic output.

- [ ] **Step 4: Run green test**

Run: `npm.cmd run test -- src/lib/gallery/intro.test.ts`

Expected: pass.

### Task 3: Intro UI

**Files:**
- Create: `src/components/gallery/LoadingIntro.tsx`
- Modify: `src/components/gallery/GalleryExperience.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Render intro for loading state**

Use `LoadingIntro` instead of the raw `gallery-state` loading paragraph.

- [ ] **Step 2: Style the intro**

Add responsive, minimal off-white styling. Keep reduced-motion behavior static and avoid layout overflow.

- [ ] **Step 3: Update phase label**

Change the header phase label to Phase 9 polish.

### Task 4: Verification And Harness Close

**Files:**
- Modify: `docs/stories/epics/E01-foundation/US-010-loading-intro-polish.md`
- Modify: `docs/TEST_MATRIX.md`

- [ ] **Step 1: Run verification**

Run `npm.cmd run test -- src/lib/gallery/intro.test.ts`, `npm.cmd run test`, `npm.cmd run typecheck`, and `npm.cmd run build`.

- [ ] **Step 2: Run browser smoke fallback**

Start production server and use Playwright CLI for desktop/mobile smoke, saving screenshots under `output/playwright/`.

- [ ] **Step 3: Update Harness**

Update story evidence, update matrix docs, run `story verify US-010`, and record trace.
